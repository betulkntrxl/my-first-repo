import express from 'express';
import { createProxyMiddleware, fixRequestBody, responseInterceptor } from 'http-proxy-middleware';
import { logger } from '../configs/logger.js';

export const setupRoutes = (expressWebServer, oidc, appInsights) => {
  // Check to see if user is logged in, if not redirect them to login route
  /* eslint-disable */
  function ensureAuthenticatedRedirectIfNot(req, res, next) {
    logger.info(`Checking if user is authenticated...`);

    if (!isAuthenticated(req)) {
      logger.info(`Redirecting to login`);
      return res.redirect('/api/auth/login'); // redirect to login route
    }

    next();
  }
  /* eslint-enable */

  // Check to see if user is logged in, if not return HTTP Status 401
  /* eslint-disable */
  function ensureAuthenticated401IfNot(req, res, next) {
    logger.info(`Checking if user is authenticated for API...`);

    if (!isAuthenticated(req)) {
      logger.warn(`Session may have expired, returning HTTP Status 401 for prompt api`);
      return res.status(401).send('User is not logged in, authenticate path is /api/auth/login');
    }

    next();
  }
  /* eslint-enable */

  function isAuthenticated(req) {
    if (
      process.env.ALLOW_TEST_USER === 'true' &&
      req.header('TEST_USER_API_KEY') &&
      req.header('TEST_USER_API_KEY') === process.env.TEST_USER_API_KEY
    ) {
      logger.info('Test user is authenticated...');
      return true;
    }

    logger.info(req.isAuthenticated() ? 'User is authenticated' : 'User is not authenticated');

    return req.isAuthenticated();
  }

  // App Version
  expressWebServer.get('/api/version', async (req, res, next) => {
    const VERSION = process.env.VERSION || 'local-dev';
    res.send(`{"version": "${VERSION}"}`);
  });

  // App Insights Events
  expressWebServer.post(
    '/api/app-insights-event',
    ensureAuthenticated401IfNot,
    async (req, res, next) => {
      logger.debug(`ChatApp App Insights Event ${JSON.stringify(req.body)}`);
      if (process.env.DEPLOY_ENVIRONMENT === 'cloud') {
        appInsights.defaultClient.trackEvent(req.body);
      }
      return res.status(201).end();
    },
  );

  // App Insights Trace, Severity Levels available
  // Verbose = 0,
  // Information = 1,
  // Warning = 2,
  // Error = 3,
  // Critical = 4
  expressWebServer.post(
    '/api/app-insights-trace',
    ensureAuthenticated401IfNot,
    async (req, res, next) => {
      logger.debug(`ChatApp App Insights Trace ${JSON.stringify(req.body)}`);
      if (process.env.DEPLOY_ENVIRONMENT === 'cloud') {
        appInsights.defaultClient.trackTrace(req.body);
      }
      return res.status(201).end();
    },
  );

  // Intercept the prompt request, check auth and add headers
  expressWebServer.use('/api/prompt', ensureAuthenticated401IfNot, async (req, res, next) => {
    logger.info(`Adding required and optional headers to http request to Mulesoft...`);

    // Adding headers for Mulesoft API
    req.headers.client_id = process.env.MULESOFT_OPENAI_CLIENT_ID;
    req.headers.client_secret = process.env.MULESOFT_OPENAI_CLIENT_SECRET;
    if (process.env.ALLOW_TEST_USER === 'true' && req.header('TEST_USER_API_KEY')) {
      logger.info('using fake email for test user');
      req.headers.urn = 'test-user@mckesson.com';
    } else {
      req.headers.urn =
        req.userContext.userinfo.email || req.userContext.userinfo.preferred_username;
    }

    // TODO: Need to figure out how to get the BU for the user
    req.headers.bu = '';

    next();
  });

  // Creating a proxy to the Mulesoft OpenAI Chat API
  const mulesoftOpenAIChatApiProxy = createProxyMiddleware({
    target: process.env.MULESOFT_OPENAI_CHAT_API_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/prompt': '' },
    onProxyReq: fixRequestBody,
    onError: (err, req, res) => {
      logger.error(`Failed proxying to API... ${err} `);

      res.writeHead(500, {
        'Content-Type': 'application/json',
      });

      res.end(
        `{ "errorMessage": Sometime went wrong proxying to the OpenAI Chat API, the service could be busy please try again later.} `,
      );
    },
    selfHandleResponse: true,
    onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
      if (proxyRes.statusCode !== 200) {
        logger.error(
          `Chat API Failed... HTTP Status Code ${
            proxyRes.statusCode
          } HTTP Error Message ${responseBuffer.toString('utf8')} `,
        );
        if (process.env.DEPLOY_ENVIRONMENT === 'cloud') {
          appInsights.defaultClient.trackTrace({
            message: 'ChatApp Prompt API Failed',
            severity: 3, // Error
            properties: {
              httpStatusCode: proxyRes.statusCode,
              errorMessage: responseBuffer.toString('utf8'),
            },
          });
        }
      } else {
        logger.info(`Prompt request successful ${proxyRes.statusCode} `);
      }
      return responseBuffer;
    }),
    logger: console,
  });

  // Prompt api which gets proxied to the Mulesoft OpenAi Chat API
  // Note the user needs to be authenticated before calling this.
  // The auth check is done in the .use('/api/prompt'... above
  expressWebServer.post('/api/prompt', mulesoftOpenAIChatApiProxy);

  // Make sure the user is authenticated before serving static content
  expressWebServer.get('/', ensureAuthenticatedRedirectIfNot);

  expressWebServer.get('/api/auth/logout', oidc.forceLogoutAndRevoke(), (req, res) => {
    // Nothing here will execute, after the redirects the user will end up at the root / again
  });

  // Serving the static content i.e. the React App
  expressWebServer.use(express.static('./build'));
};

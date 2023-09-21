import express from 'express';
import { ensureAuthenticatedRedirectIfNot, ensureAuthenticated401IfNot } from './auth-helpers.js';
import { logger } from '../configs/logger.js';

const setupRoutes = (expressWebServer, okta, mulesoftProxy, appInsights) => {
  logger.info(`Setting up Okta Routes...`);
  // Setup Okta routes
  expressWebServer.use(okta.router);

  expressWebServer.get('/api/auth/logout', okta.forceLogoutAndRevoke(), (req, res) => {
    // Nothing here will execute, after the redirects the user will end up at the root / again
  });

  logger.info(`Okta Routes complete`);

  logger.info(`Setting up other API routes...`);
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

  // Prompt api which gets proxied to the Mulesoft OpenAi Chat API
  // Note the user needs to be authenticated before calling this.
  // The auth check is done in the .use('/api/prompt'... above
  expressWebServer.post('/api/prompt', mulesoftProxy);

  // Make sure the user is authenticated before serving static content
  expressWebServer.get('/', ensureAuthenticatedRedirectIfNot);

  logger.info(`Other API Routes setup complete`);

  logger.info(`Serving static content...`);

  // Serving the static content i.e. the React App
  expressWebServer.use(express.static('./build'));

  logger.info(`App is now serviing static content`);
};

export { setupRoutes };

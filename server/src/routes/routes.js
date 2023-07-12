import express from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { logger } from '../configs/logger.js';

export const setupRoutes = expressWebServer => {
  // App Version
  expressWebServer.use('/api/version', async (req, res, next) => {
    res.send(`{"version": "${process.env.VERSION}"}`);
  });

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
      logger.info(`Returning HTTP Status 401`);
      return res.status(401).send('User is not logged in, authenticate path is /api/auth/login');
    }

    next();
  }
  /* eslint-enable */

  function isAuthenticated(req) {
    logger.info(
      req.session.isAuthenticated ? 'User is authenticated' : 'User is not authenticated'
    );

    return req.session.isAuthenticated;
  }

  // Intercept the prompt request and inject the api key
  expressWebServer.use('/api/prompt', async (req, res, next) => {
    logger.info(`Adding required and optional headers to http request to Mulesoft...`);

    // Adding headers for Mulesoft API
    req.headers.client_id = process.env.MULESOFT_OPENAI_CLIENT_ID;
    req.headers.client_secret = process.env.MULESOFT_OPENAI_CLIENT_SECRET;
    req.headers.urn = req.session.account.idTokenClaims.email;
    // TODO: Harcoding for now until we figure out how to get the BU for the user
    req.headers.bu = 'MckTech';

    next();
  });

  // Creating a proxy to the OpenAI API
  const openAIApiProxy = createProxyMiddleware({
    target: process.env.MULESOFT_OPENAI_CHAT_API_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/prompt': '' },
    onProxyReq: fixRequestBody,
    logger: console,
  });

  // Prompt api which gets proxied to the openai api
  expressWebServer.post('/api/prompt', ensureAuthenticated401IfNot, openAIApiProxy);

  // Make sure the user is authenticated before serving static content
  expressWebServer.use('/', ensureAuthenticatedRedirectIfNot);

  // Serving the static content i.e. the React App
  expressWebServer.use(express.static('./build'));
};

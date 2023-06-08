import express from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { logger } from '../configs/logger.js';

export const setupRoutes = expressWebServer => {
  // Check to see if user is logged in, if not redirect them to login
  /* eslint-disable */
  function isAuthenticated(req, res, next) {
    //By passing authentication when running locally with Create React App Dev Server
    if (process.env.DEPLOY_ENVIRONMENT === 'local-react-server') {
      logger.info(`By passing authentication check...`);
      next();
    } else {
      logger.info(`Checking if user is authenticated...`);

      if (!req.session.isAuthenticated) {
        logger.info(`User is not authenticated redirecting to login`);

        return res.redirect('/api/auth/login'); // redirect to login route
      }

      logger.info(`User is authenticated`);

      next();
    }
  }
  /* eslint-enable */

  // Intercept the prompt request and inject the api key
  expressWebServer.use('/api/prompt', async (req, res, next) => {
    logger.info(`Adding api key header to http request...`);

    // Adding api key in header
    req.headers['api-key'] = process.env.OPEN_AI_API_KEY;

    next();
  });

  // Creating a proxy to the OpenAI API
  const openAIApiProxy = createProxyMiddleware({
    target:
      'https://openai-nonprod-test4.openai.azure.com/openai/deployments/openai-nonprod-gpt35-turbo-test4/chat/completions?api-version=2023-03-15-preview',
    changeOrigin: true,
    pathRewrite: { '^/api/prompt': '' },
    onProxyReq: fixRequestBody,
    logger: console,
  });

  // Prompt api which gets proxied to the openai api
  expressWebServer.post('/api/prompt', isAuthenticated, openAIApiProxy);

  // Make sure the user is authenticated before serving static content
  expressWebServer.use('/', isAuthenticated);

  // Serving the static content i.e. the React App
  expressWebServer.use(express.static('./build'));
};

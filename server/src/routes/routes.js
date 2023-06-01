import express from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { logger } from '../configs/logger.js';

export const setupRoutes = expressWebServer => {
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
  expressWebServer.post('/api/prompt', openAIApiProxy);

  // Serving the static content i.e. the React App
  expressWebServer.use(express.static('./build'));
};

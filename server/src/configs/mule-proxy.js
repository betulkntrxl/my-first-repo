import { createProxyMiddleware, fixRequestBody, responseInterceptor } from 'http-proxy-middleware';
import { logger } from './logger.js';

const setupMulesoftProxy = appInsights => {
  logger.info(`Setting up Mulesoft Proxy...`);

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

  logger.info(`Mulesoft Proxy setup complete`);

  return mulesoftOpenAIChatApiProxy;
};

export { setupMulesoftProxy };

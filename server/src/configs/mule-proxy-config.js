import { createProxyMiddleware, fixRequestBody, responseInterceptor } from 'http-proxy-middleware';
import { logger } from './logger-config.js';

const setupMulesoftProxyGPT35Turbo = appInsights => {
  logger.info(`Setting up Mulesoft 3.5 Turbo Proxy...`);

  // Creating a proxy to the Mulesoft 3.5 Turbo OpenAI Chat API
  const mulesoft35TurboOpenAIChatApiProxy = createProxyMiddleware({
    target: process.env.MULESOFT_OPENAI_CHAT_API_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/prompt/35turbo': '' },
    onProxyReq: fixRequestBody,
    onError: (err, req, res) => {
      logger.error(`Failed proxying to 3.5 Turbo API... ${err} `);

      res.writeHead(500, {
        'Content-Type': 'application/json',
      });

      res.end(
        `{ "errorMessage": Sometime went wrong proxying to the 3.5 Turbo API, the service could be busy please try again later.} `,
      );
    },
    selfHandleResponse: true,
    onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
      if (proxyRes.statusCode !== 200) {
        logger.error(
          `Chat 3.5 Turbo API Failed... HTTP Status Code ${
            proxyRes.statusCode
          } HTTP Error Message ${responseBuffer.toString('utf8')} `,
        );
        if (process.env.DEPLOY_ENVIRONMENT === 'cloud') {
          appInsights.defaultClient.trackTrace({
            message: 'ChatApp 3.5 Turbo Prompt API Failed',
            severity: 3, // Error
            properties: {
              httpStatusCode: proxyRes.statusCode,
              errorMessage: responseBuffer.toString('utf8'),
            },
          });
        }
      } else {
        logger.info(`3.5 Turbo Prompt request successful ${proxyRes.statusCode} `);
      }
      return responseBuffer;
    }),
    logger: console,
  });

  logger.info(`Mulesoft 3.5 Turbo Proxy setup complete`);

  return mulesoft35TurboOpenAIChatApiProxy;
};

const setupMulesoftProxyGPT4 = appInsights => {
  logger.info(`Setting up Mulesoft GPT4 Proxy...`);

  // Creating a proxy to the Mulesoft GPT4 OpenAI Chat API
  const mulesoftGPT4OpenAIChatApiProxy = createProxyMiddleware({
    target: process.env.MULESOFT_OPENAI_CHAT_API_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/prompt/gpt4': '' },
    onProxyReq: fixRequestBody,
    onError: (err, req, res) => {
      logger.error(`Failed proxying to GPT4 API... ${err} `);

      res.writeHead(500, {
        'Content-Type': 'application/json',
      });

      res.end(
        `{ "errorMessage": Sometime went wrong proxying to the GPT4 OpenAI Chat API, the service could be busy please try again later.} `,
      );
    },
    selfHandleResponse: true,
    onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
      if (proxyRes.statusCode !== 200) {
        logger.error(
          `Chat GPT4 API Failed... HTTP Status Code ${
            proxyRes.statusCode
          } HTTP Error Message ${responseBuffer.toString('utf8')} `,
        );
        if (process.env.DEPLOY_ENVIRONMENT === 'cloud') {
          appInsights.defaultClient.trackTrace({
            message: 'ChatApp GPT4 Prompt API Failed',
            severity: 3, // Error
            properties: {
              httpStatusCode: proxyRes.statusCode,
              errorMessage: responseBuffer.toString('utf8'),
            },
          });
        }
      } else {
        logger.info(`GPT4 Prompt request successful ${proxyRes.statusCode} `);
      }
      return responseBuffer;
    }),
    logger: console,
  });

  logger.info(`Mulesoft GPT4 Proxy setup complete`);

  return mulesoftGPT4OpenAIChatApiProxy;
};

export { setupMulesoftProxyGPT35Turbo, setupMulesoftProxyGPT4 };

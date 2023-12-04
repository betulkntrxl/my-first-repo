import { createProxyMiddleware, fixRequestBody, responseInterceptor } from 'http-proxy-middleware';
import { v4 as uuidv4 } from 'uuid';
import { logger } from './logger-config.js';

const createErrorMessage = (uuid, openAIErrorCode, openAIErrorMessage) => {
  const errorMessage = {
    id: uuid,
    openAIErrorCode,
    message: openAIErrorMessage,
  };
  return Buffer.from(JSON.stringify(errorMessage));
};

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
      let clientResponse;

      if (proxyRes.statusCode !== 200) {
        const errorId = uuidv4();
        logger.error(
          `Chat API Failed... Error Id ${errorId} HTTP Status Code ${
            proxyRes.statusCode
          } HTTP Error Message ${responseBuffer.toString('utf8')} `,
        );

        if (process.env.DEPLOY_ENVIRONMENT === 'cloud') {
          appInsights.defaultClient.trackTrace({
            message: 'ChatApp Prompt API Failed',
            severity: 3, // Error
            properties: {
              chatAppErrorId: errorId,
              httpStatusCode: proxyRes.statusCode,
              errorMessage: responseBuffer.toString('utf8'),
            },
          });
        }
        // Respond with a consistent error message
        // while also hiding api error details
        let openAIErrorCode = 'N/A';
        let openAIErrorMessage =
          'Unfortunately something went wrong, if you would like to report this issue please include the id of this error.';

        const mulesoftErrorMessage = JSON.parse(responseBuffer.toString('utf8'));
        if (
          mulesoftErrorMessage.errorDetails[1] &&
          mulesoftErrorMessage.errorDetails[1].message &&
          mulesoftErrorMessage.errorDetails[1].message.error &&
          mulesoftErrorMessage.errorDetails[1].message.error.code &&
          mulesoftErrorMessage.errorDetails[1].message.error.message
        ) {
          openAIErrorCode = mulesoftErrorMessage.errorDetails[1].message.error.code;
          openAIErrorMessage = mulesoftErrorMessage.errorDetails[1].message.error.message;
        }
        clientResponse = createErrorMessage(errorId, openAIErrorCode, openAIErrorMessage);
      } else {
        logger.info(`Prompt request successful ${proxyRes.statusCode} `);
        clientResponse = responseBuffer;
      }

      return clientResponse;
    }),
    logger: console,
  });

  logger.info(`Mulesoft Proxy setup complete`);

  return mulesoftOpenAIChatApiProxy;
};

export { setupMulesoftProxy };

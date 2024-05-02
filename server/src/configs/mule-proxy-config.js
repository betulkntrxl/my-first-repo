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

const setupMulesoftProxyGPT35Turbo = appInsights => {
  logger.info(`Setting up Mulesoft 3.5 Turbo Proxy...`);

  // Creating a proxy to the Mulesoft 3.5 Turbo OpenAI Chat API
  const mulesoft35TurboOpenAIChatApiProxy = createProxyMiddleware({
    target: process.env.MULESOFT_OPENAI_CHAT_API_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/prompt/gpt35turbo': '' },
    on: {
      proxyReq: fixRequestBody,
      error: (err, req, res) => {
        logger.error(`Failed proxying to 3.5 Turbo API... ${err} `);

        res.writeHead(500, {
          'Content-Type': 'application/json',
        });

        res.end(
          `{ "errorMessage": Sometime went wrong proxying to the 3.5 Turbo API, the service could be busy please try again later.} `,
        );
      },
      proxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
        let clientResponse;

        if (proxyRes.statusCode !== 200) {
          const errorId = uuidv4();
          logger.error(
            `Chat 3.5 Turbo API Failed... Error Id ${errorId} HTTP Status Code ${
              proxyRes.statusCode
            } HTTP Error Message ${responseBuffer.toString('utf8')} `,
          );

          if (process.env.DEPLOY_ENVIRONMENT === 'cloud') {
            appInsights.defaultClient.trackTrace({
              message: 'ChatApp 3.5 Turbo Prompt API Failed',
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

          try {
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
          } catch (jsonParseError) {
            logger.error(`Error parsing responseBuffer to JSON ${jsonParseError}`);
          }
          clientResponse = createErrorMessage(errorId, openAIErrorCode, openAIErrorMessage);
        } else {
          logger.info(`3.5 Turbo Prompt request successful ${proxyRes.statusCode} `);
          clientResponse = responseBuffer;
        }

        return clientResponse;
      }),
    },
    selfHandleResponse: true,
    logger: console,
  });

  logger.info(`Mulesoft 3.5 Turbo Proxy setup complete`);

  return mulesoft35TurboOpenAIChatApiProxy;
};

const setupMulesoftProxyGPT4 = appInsights => {
  logger.info(`Setting up Mulesoft GPT4 Proxy...`);

  // Creating a proxy to the Mulesoft GPT4 OpenAI Chat API
  const mulesoftGPT4OpenAIChatApiProxy = createProxyMiddleware({
    target: process.env.MULESOFT_OPENAI_CHAT_API_URL_GPT4,
    changeOrigin: true,
    pathRewrite: { '^/api/prompt/gpt4': '' },
    on: {
      proxyReq: fixRequestBody,
      error: (err, req, res) => {
        logger.error(`Failed proxying to GPT 4 API... ${err} `);

        res.writeHead(500, {
          'Content-Type': 'application/json',
        });

        res.end(
          `{ "errorMessage": Sometime went wrong proxying to the GPT 4 API, the service could be busy please try again later.} `,
        );
      },
      proxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
        let clientResponse;

        if (proxyRes.statusCode !== 200) {
          const errorId = uuidv4();
          logger.error(
            `Chat GPT 4 API Failed... Error Id ${errorId} HTTP Status Code ${
              proxyRes.statusCode
            } HTTP Error Message ${responseBuffer.toString('utf8')} `,
          );

          if (process.env.DEPLOY_ENVIRONMENT === 'cloud') {
            appInsights.defaultClient.trackTrace({
              message: 'ChatApp GPT 4 Prompt API Failed',
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

          try {
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
          } catch (jsonParseError) {
            logger.error(`Error parsing responseBuffer to JSON ${jsonParseError}`);
          }
          clientResponse = createErrorMessage(errorId, openAIErrorCode, openAIErrorMessage);
        } else {
          logger.info(`GPT 4 Prompt request successful ${proxyRes.statusCode} `);
          clientResponse = responseBuffer;
        }

        return clientResponse;
      }),
    },
    selfHandleResponse: true,
    logger: console,
  });

  logger.info(`Mulesoft GPT4 Proxy setup complete`);

  return mulesoftGPT4OpenAIChatApiProxy;
};

export { setupMulesoftProxyGPT35Turbo, setupMulesoftProxyGPT4 };

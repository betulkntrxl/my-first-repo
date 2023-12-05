import axios from 'axios';
import axiosRetry from 'axios-retry';
import MetricsClient from './MetricsClient';

const setupRetryConfig = () => {
  axiosRetry(axios, {
    retries: 2,
    shouldResetTimeout: true,
    onRetry: (retryCount, error) => {
      // error wasn't a proper object so using JSON.parse to make it so
      const ERROR_RESPONSE = JSON.parse(JSON.stringify(error));

      // Tracking retry in app insights
      MetricsClient.sendTrace({
        message: 'ChatApp Retry Prompt',
        severity: 2, // Warning
        properties: { retryCount, errorCode: error.code, errorStatusCode: ERROR_RESPONSE.status },
      });
    },
    retryCondition: error => {
      // error wasn't a proper object so using JSON.parse to make it so
      const ERROR_RESPONSE = JSON.parse(JSON.stringify(error));
      const HTTP_METHOD = ERROR_RESPONSE.config?.method;
      const ERROR_RESPONSE_STATUS = ERROR_RESPONSE.status;
      const ERROR_URL = ERROR_RESPONSE.config.url;

      return (
        // Only retry on prompt requests with specific error status
        ERROR_URL === '/api/prompt' &&
        HTTP_METHOD === 'post' &&
        (axiosRetry.isNetworkOrIdempotentRequestError(error) ||
          // Retry on ChatApp timeout
          error.code === 'ECONNABORTED' ||
          // Retry on Prompt OpenAI API Timeout
          ERROR_RESPONSE_STATUS === 408 ||
          // Retry on Prompt Mulesoft API Timeout
          ERROR_RESPONSE_STATUS === 504 ||
          // Retry on Prompt server error from Mulesoft
          ERROR_RESPONSE_STATUS === 500 ||
          // Retry on Prompt Bad Gateway from Mulesoft
          ERROR_RESPONSE_STATUS === 502)
      );
    },
  });
};

export { setupRetryConfig };

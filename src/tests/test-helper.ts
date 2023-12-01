import axios from 'axios';
import {
  successPromptResponse,
  successIsAuthenticatedResponse,
  successGetVersionResponse,
  successGetOrgDeployment,
  successPostMetricEvent,
  successPostMetricTrace,
} from './test-data';

const setupMockAxiosSuccessResponses = (mockedAxios: jest.Mocked<typeof axios>) => {
  mockedAxios.get.mockImplementation((url: string) => {
    switch (url) {
      case '/api/auth/isAuthenticated':
        return Promise.resolve(successIsAuthenticatedResponse);
      case '/api/version':
        return Promise.resolve(successGetVersionResponse);
      case '/api/org-deployment':
        return Promise.resolve(successGetOrgDeployment);
      default:
        return Promise.reject(new Error('not found'));
    }
  });

  mockedAxios.post.mockImplementation((url: string) => {
    switch (url) {
      case '/api/prompt':
        return Promise.resolve(successPromptResponse);
      case '/api/app-insights-event':
        return Promise.resolve(successPostMetricEvent);
      case '/api/app-insights-trace':
        return Promise.resolve(successPostMetricTrace);
      default:
        return Promise.reject(new Error('not found'));
    }
  });
};

const setupMockAxiosOpenAIAPIFailureResponses = (
  mockedAxios: jest.Mocked<typeof axios>,
  httpStatusCode: number,
) => {
  mockedAxios.get.mockImplementation((url: string) => {
    switch (url) {
      case '/api/auth/isAuthenticated':
        return Promise.resolve(successIsAuthenticatedResponse);
      case '/api/version':
        return Promise.resolve(successGetVersionResponse);
      case '/api/org-deployment':
        return Promise.resolve(successGetOrgDeployment);
      default:
        return Promise.reject(new Error('not found'));
    }
  });

  mockedAxios.post.mockImplementation((url: string) => {
    switch (url) {
      /* eslint-disable */
      case '/api/prompt':
        return Promise.reject({
          response: {
            status: httpStatusCode,
          },
        });
      /* eslint-enable */
      case '/api/app-insights-event':
        return Promise.resolve(successPostMetricEvent);
      case '/api/app-insights-trace':
        return Promise.resolve(successPostMetricTrace);
      default:
        return Promise.reject(new Error('not found'));
    }
  });
};

export { setupMockAxiosSuccessResponses, setupMockAxiosOpenAIAPIFailureResponses };

import React from 'react';
import axios from 'axios';
import { render, cleanup, screen, waitFor, act, fireEvent } from '@testing-library/react';

import App from '../App';
import { setupMockAxiosSuccessResponses } from './test-helper';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const MOCK_RESOURCE_BUNDLE = {
  menu: {
    'assistant-setup': {
      'message-template': {
        'system-message-template': {
          template1: 'En',
        },
      },
    },
  },
};

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: () => 'En',
    i18n: {
      /* eslint-disable */
      changeLanguage: () => new Promise(() => {}),
      getResourceBundle: (bundle: String, namespace: String) => MOCK_RESOURCE_BUNDLE,
      /* eslint-enable */
    },
  }),
}));

describe('testing changing the language', () => {
  afterEach(cleanup);

  it('change language to english', async () => {
    setupMockAxiosSuccessResponses(mockedAxios);
    await act(async () => {
      render(<App />);

      await waitFor(() => expect(screen.getByLabelText('language')).toBeVisible()).then(() => {
        const languageElement = screen.getByLabelText('language');

        fireEvent.click(languageElement);

        expect(languageElement).toBeTruthy();
      });
    });
  });

  it('change language to french', async () => {
    setupMockAxiosSuccessResponses(mockedAxios);
    await act(async () => {
      render(<App />);

      await waitFor(() => expect(screen.getByLabelText('language')).toBeVisible()).then(() => {
        const languageElement = screen.getByLabelText('language');

        fireEvent.click(languageElement);

        expect(languageElement).toBeTruthy();
      });
    });
  });
});

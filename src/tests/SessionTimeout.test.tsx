import React from 'react';
import axios from 'axios';

import { render, cleanup, screen, waitFor, fireEvent, act } from '@testing-library/react';

import App from '../App';
import { successIsAuthenticatedNotAuthenticatedResponse } from './test-data';
import { setupMockAxiosSuccessResponses } from './test-helper';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('testing session expired', () => {
  afterEach(cleanup);

  it('shows the session expired dialog when authentication api returns 401', async () => {
    jest.useFakeTimers();
    setupMockAxiosSuccessResponses(mockedAxios);
    act(() => {
      render(<App />);
    });
    jest.advanceTimersByTime(30000);
    // wait for message box
    await waitFor(() => expect(screen.getByTitle('sendmessage')).toBeVisible()).then(async () => {
      mockedAxios.get.mockResolvedValue(successIsAuthenticatedNotAuthenticatedResponse);
      // wait for dialog to be rendered
      await waitFor(() => expect(screen.getByTitle('cancel-button')).toBeVisible(), {
        timeout: 40000,
      }).then(() => {
        expect(
          screen.getByText('popup-messages.session-expired-header', { exact: false }),
        ).toBeTruthy();
        fireEvent.click(screen.getByTitle('cancel-button'));
        const sendElement = screen.getByTitle('send');
        expect(sendElement).toBeTruthy();
      });
    });
  }, 10000);
});

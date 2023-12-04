import React from 'react';
import axios from 'axios';

import { render, cleanup, screen, waitFor, fireEvent, act } from '@testing-library/react';

import App from '../App';
import { setupMockAxiosSuccessResponses } from './test-helper';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Token Input Limit', () => {
  afterEach(cleanup);

  it('sends a message which is too large and returns too large error message', async () => {
    setupMockAxiosSuccessResponses(mockedAxios);
    await act(async () => {
      render(<App />);
      await waitFor(() => expect(screen.getByTitle('sendmessage')).toBeVisible()).then(async () => {
        const sendmessageElement = screen.getByTitle('sendmessage');

        fireEvent.click(sendmessageElement);
        fireEvent.change(sendmessageElement, {
          // For file readability TOO_MUCH_TEXT is defined at the end of this file
          /* eslint-disable */
          target: { value: TOO_MUCH_TEXT },
          /* eslint-enable */
        });
        // await user.keyboard('hello');
        const sendElement = screen.getByTitle('send');
        fireEvent.click(sendElement);

        // wait for dialog to be rendered
        await waitFor(() => expect(screen.getByTitle('close-button')).toBeVisible()).then(() => {
          fireEvent.click(screen.getByTitle('close-button'));
          expect(sendElement).toBeTruthy();
        });
      });
    });
  });
});

/* eslint-disable */
const TOO_MUCH_TEXT =
  'Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text ';
/* eslint-enable */

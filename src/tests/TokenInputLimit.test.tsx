import React from 'react';
import axios from 'axios';

import { render, cleanup, screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../App';
import { setupMockAxiosSuccessResponses } from './test-helper';
import { TOO_MUCH_TEXT } from './test-data-send-message';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Token Input Limit', () => {
  afterEach(cleanup);

  it('sends a message which is too large and returns too large error message', async () => {
    setupMockAxiosSuccessResponses(mockedAxios);
    await act(async () => {
      render(<App />);
      const user = userEvent.setup();
      await waitFor(() => expect(screen.getByTitle('sendmessage')).toBeVisible()).then(async () => {
        const sendmessageElement = screen.getByTitle('sendmessage') as HTMLInputElement;

        // For some reason user.keyboard(TOO_MUCH_TEXT) just hangs
        // If we just use fireEvent then the send button won't become enabled
        // And the test will fail so for a work around I'm using user.keyboard
        // to enter some text first, this enables the send button
        // and then use fireEvent to put in the TOO_MUCH_TEXT
        await user.click(sendmessageElement);

        await user.keyboard('enable send button');

        fireEvent.click(sendmessageElement);
        sendmessageElement.value = TOO_MUCH_TEXT;
        // fireEvent.change(sendmessageElement, {
        //   // For file readability TOO_MUCH_TEXT is defined at the end of this file
        //   /* eslint-disable */
        //   target: { value: TOO_MUCH_TEXT },
        //   /* eslint-enable */
        // });

        const sendElementBtn = screen.getByTitle('send');
        fireEvent.click(sendElementBtn);

        // wait for dialog to be rendered
        await waitFor(() => {
          expect(screen.getByTitle('close-button')).toBeVisible();
        }).then(() => {
          expect(
            screen.getByText('popup-messages.input-too-large-header', { exact: false }),
          ).toBeTruthy();
          fireEvent.click(screen.getByTitle('close-button'));
          expect(sendElementBtn).toBeTruthy();
        });
      });
    });
  });
});

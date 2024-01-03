import React from 'react';
import axios from 'axios';

import { render, cleanup, screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../App';
import { setupMockAxiosSuccessResponses } from './test-helper';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('testing Reset Chat', () => {
  afterEach(cleanup);

  it('click reset chat button and then click cancel', async () => {
    setupMockAxiosSuccessResponses(mockedAxios);
    await act(async () => {
      render(<App />);
      const user = userEvent.setup();
      await waitFor(() => expect(screen.getByTitle('reset')).toBeVisible()).then(async () => {
        const resetElement = screen.getByTitle('reset');

        await user.click(resetElement);
        // wait for element to be rendered
        await waitFor(() => expect(screen.getByTitle('cancel-button')).toBeVisible()).then(() => {
          expect(
            screen.getByText('popup-messages.reset-chat-header', { exact: false }),
          ).toBeTruthy();
          const cancelElement = screen.getByTitle('cancel-button');
          fireEvent.click(cancelElement);
          expect(resetElement).toBeTruthy();
        });
      });
    });
  });
});

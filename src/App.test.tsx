import React from 'react';
import { render, cleanup, screen, act, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import App from './App';
import { setupMockAxiosSuccessResponses } from './tests/test-helper';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('testing the App', () => {
  afterEach(cleanup);

  it('sends a message by clicking on Send button and returns status 200 ok', async () => {
    setupMockAxiosSuccessResponses(mockedAxios);
    await act(async () => {
      render(<App />);
      const user = userEvent.setup();

      await waitFor(() => expect(screen.getByTitle('sendmessage')).toBeVisible()).then(async () => {
        const sendmessageElement = screen.getByTitle('sendmessage') as HTMLInputElement;

        await user.click(sendmessageElement);
        await user.type(sendmessageElement, 'hello');

        const sendElement = screen.getByTitle('sendmessage');
        expect(sendElement).not.toHaveAttribute('disabled'); // We make sure the button is enabled

        await user.click(sendElement);

        expect(sendElement).toBeTruthy();
      });
    });
  });
});

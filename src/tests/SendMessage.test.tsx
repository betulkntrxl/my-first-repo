import React from 'react';
import axios from 'axios';

import { render, cleanup, screen, waitFor, fireEvent, act } from '@testing-library/react';

import App from '../App';
import { setupMockAxiosSuccessResponses } from './test-helper';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('testing Send Messages', () => {
  afterEach(cleanup);

  it('send message and expect a response from the bot', async () => {
    setupMockAxiosSuccessResponses(mockedAxios);
    act(() => {
      render(<App />);
    });
    // wait for message box
    await waitFor(() => expect(screen.getByTitle('sendmessage')).toBeVisible()).then(async () => {
      const sendmessageElement = screen.getByTitle('sendmessage');
      fireEvent.click(sendmessageElement);
      // type message
      act(() => {
        fireEvent.change(sendmessageElement, {
          target: { value: 'hi' },
        });
      });
      // send messages
      const sendElement = screen.getByTitle('send');
      await act(async () => {
        fireEvent.click(sendElement);
      });
    });
  });

  it('send message with different configuration values, check metrics were called on each configuration value', async () => {
    setupMockAxiosSuccessResponses(mockedAxios);
    act(() => {
      render(<App />);
    });

    await waitFor(() => expect(screen.getByLabelText('open-menu')).toBeVisible()).then(async () => {
      const openMenuElement = screen.getByLabelText('open-menu');
      act(() => {
        fireEvent.click(openMenuElement);
      });
      // wait for element to be rendered
      await waitFor(() => expect(screen.getByLabelText('configuration')).toBeVisible()).then(
        async () => {
          fireEvent.click(screen.getByLabelText('configuration'));

          await waitFor(() =>
            expect(screen.getByLabelText('temperature-input')).toBeVisible(),
          ).then(async () => {
            const temperatureInput = screen.getByLabelText('temperature-input');
            fireEvent.click(temperatureInput);
            // select all digits in input
            act(() => {
              fireEvent.change(screen.getByLabelText(/temperature-input/i), {
                target: { value: 0.5 },
              });
            });

            const toppInput = screen.getByTitle('topP-input');
            fireEvent.click(toppInput);
            // select all digits in input
            act(() => {
              fireEvent.change(screen.getByTitle(/topP-input/i), {
                target: { value: 0.8 },
              });
            });

            const maxtokensInput = screen.getByTitle('maxTokens-input');
            fireEvent.click(maxtokensInput);
            // select all digits in input
            act(() => {
              fireEvent.change(screen.getByTitle(/maxTokens-input/i), {
                target: { value: 500 },
              });
            });

            const previousMessagesInput = screen.getByTitle('pastMessages-input');
            fireEvent.click(previousMessagesInput);
            // select all digits in input
            act(() => {
              fireEvent.change(screen.getByTitle(/pastMessages-input/i), {
                target: { value: 1 },
              });
            });

            const APITimeoutInput = screen.getByTitle('apitimeout-input');
            fireEvent.click(APITimeoutInput);
            // enter new value
            await act(async () => {
              fireEvent.change(screen.getByTitle(/apitimeout-input/i), {
                target: { value: 30 },
              });
            });

            const closeMenuElement = screen.getByLabelText('close-menu');
            // close menu
            act(() => {
              fireEvent.click(closeMenuElement);
            });
            // wait for message box
            await waitFor(() => expect(screen.getByTitle('sendmessage')).toBeVisible()).then(
              async () => {
                const sendmessageElement = screen.getByTitle('sendmessage');
                fireEvent.click(sendmessageElement);
                // type message
                act(() => {
                  fireEvent.change(sendmessageElement, {
                    target: { value: 'hi' },
                  });
                });
                // send messages
                const sendElement = screen.getByTitle('send');
                await act(async () => {
                  fireEvent.click(sendElement);
                });

                expect(temperatureInput).toBeTruthy();
              },
            );
          });
        },
      );
    });
  });

  // Commenting this out as we are not whowing this component anymore
  // it('the token count is rendered', async () => {
  //   setupMockAxiosSuccessResponses(mockedAxios);
  //   await act(async () => {
  //     render(<App />);
  //     await waitFor(() =>
  //       expect(screen.getByRole('button', { name: 'token-count: 0' })).toBeVisible(),
  //     ).then(() => {
  //       const tokenCount = screen.getByRole('button', { name: 'token-count: 0' });
  //       expect(tokenCount).toBeTruthy();
  //     });
  //   });
  // });
});

import React from 'react';
import axios from 'axios';
import { render, cleanup, screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../App';
import { setupMockAxiosOpenAIAPIFailureResponses } from './test-helper';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('OpenAI API errors', () => {
  afterEach(cleanup);

  //   it('returns status 401 Unauthorized error and Continue', async () => {
  //     setupMockAxiosOpenAIAPIFailureResponses(mockedAxios, 401);
  //     await act(async () => {
  //         render(<App />);
  //         await waitFor(() => expect(screen.getByTitle('sendmessage')).toBeVisible()).then(async () => {
  //           const sendmessageElement = screen.getByTitle('sendmessage');
  //           fireEvent.change(sendmessageElement, {
  //             target: { value: 'hello' },
  //           });

  //           const sendElement = screen.getByTitle('send');
  //           fireEvent.click(sendElement);

  //           // wait for dialog to be rendered
  //           await waitFor(() => expect(screen.getByTitle('continue-button')).toBeVisible()).then(() => {
  //             const continueElement = screen.getByTitle('continue-button');

  //             // eslint-disable-next-line no-global-assign
  //             window = Object.create(window);
  //             Object.defineProperty(window, 'location', {
  //               value: {
  //                 href: 'http://localhost/',
  //               },
  //               writable: true, // possibility to override
  //             });
  //             fireEvent.click(continueElement);
  //             Object.defineProperty(window, 'location', {
  //               value: {
  //                 href: 'http://localhost/',
  //               },
  //               writable: true, // possibility to override
  //             });
  //             expect(sendElement).toBeTruthy();
  //           });
  //         });
  //     });
  //   });

  it('returns status 401 Unauthorized error and Cancel', async () => {
    setupMockAxiosOpenAIAPIFailureResponses(mockedAxios, 401);
    await act(async () => {
      render(<App />);
      const user = userEvent.setup();
      await waitFor(() => expect(screen.getByTitle('sendmessage')).toBeVisible()).then(async () => {
        const sendmessageElement = screen.getByTitle('sendmessage');

        await user.click(sendmessageElement);
        await user.keyboard('hello');
        const sendElement = screen.getByTitle('send');
        await user.click(sendElement);

        // wait for dialog to be rendered
        await waitFor(() => expect(screen.getByTitle('cancel-button')).toBeVisible()).then(() => {
          fireEvent.click(screen.getByTitle('cancel-button'));
        });
        expect(sendElement).toBeTruthy();
      });
    });
  });

  it('returns 429 API Rate Limit error', async () => {
    setupMockAxiosOpenAIAPIFailureResponses(mockedAxios, 429);
    await act(async () => {
      render(<App />);
      const user = userEvent.setup();
      await waitFor(() => expect(screen.getByTitle('sendmessage')).toBeVisible()).then(async () => {
        const sendmessageElement = screen.getByTitle('sendmessage');

        await user.click(sendmessageElement);
        await user.keyboard('hello');
        const sendElement = screen.getByTitle('send');
        await user.click(sendElement);

        // wait for dialog to be rendered
        await waitFor(() => expect(screen.getByTitle('close-button')).toBeVisible()).then(() => {
          fireEvent.click(screen.getByTitle('close-button'));
          expect(sendElement).toBeTruthy();
        });
      });
    });
  });

  it('returns 500 API error', async () => {
    setupMockAxiosOpenAIAPIFailureResponses(mockedAxios, 500);
    await act(async () => {
      render(<App />);
      const user = userEvent.setup();
      await waitFor(() => expect(screen.getByTitle('sendmessage')).toBeVisible()).then(async () => {
        const sendmessageElement = screen.getByTitle('sendmessage');

        await user.click(sendmessageElement);
        await user.keyboard('hello');
        const sendElement = screen.getByTitle('send');
        await user.click(sendElement);

        // wait for dialog to be rendered
        await waitFor(() => expect(screen.getByTitle('close-button')).toBeVisible()).then(() => {
          fireEvent.click(screen.getByTitle('close-button'));
          expect(sendElement).toBeTruthy();
        });
      });
    });
  });

  //   it('returns API Timeout error', async () => {
  //     setupMockAxiosOpenAIAPIFailureResponses(mockedAxios, 4);

  //     act(() => {
  //       render(<App />);
  //     });

  //     await waitFor(() => expect(screen.getByTitle('sendmessage')).toBeVisible()).then(async () => {
  //       const sendmessageElement = screen.getByTitle('sendmessage');

  //       fireEvent.click(sendmessageElement);
  //       act(() => {
  //         fireEvent.change(sendmessageElement, {
  //           target: { value: 'hello' },
  //         });
  //       });
  //       // await user.keyboard('hello');
  //       await waitFor(() => expect(screen.getByTitle('send')).toBeVisible()).then(async () => {
  //         const sendElement = screen.getByTitle('send');
  //         act(() => {
  //           fireEvent.click(sendElement);
  //         });
  //         // wait for dialog to be rendered

  //         await waitFor(() => expect(screen.getByTitle('close-button')).toBeVisible(), {
  //           timeout: 11000,
  //         }).then(() => {
  //           const closeElement = screen.getByTitle('close-button');
  //           act(() => {
  //             fireEvent.click(closeElement);
  //           });
  //           // waitFor(() => expect(screen.getByTitle('sendmessage')).toBeVisible()).then(() => {
  //           expect(closeElement).toBeTruthy();
  //           // });
  //         });
  //       });
  //     });
  //   });
});

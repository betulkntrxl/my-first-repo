import React from 'react';
import axios from 'axios';

import { render, cleanup, screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../App';
import { setupMockAxiosSuccessResponses } from './test-helper';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('testing API Timeout', () => {
  afterEach(cleanup);

  it('enter value within the api timeout range, should display exact value', async () => {
    setupMockAxiosSuccessResponses(mockedAxios);
    await act(async () => {
      render(<App />);
      const user = userEvent.setup();
      await waitFor(() => expect(screen.getByLabelText('menu')).toBeVisible()).then(async () => {
        const menuElement = screen.getByLabelText('menu');
        await user.click(menuElement);
        // wait for element to be rendered
        await waitFor(() => expect(screen.getByLabelText('configuration')).toBeVisible()).then(
          async () => {
            fireEvent.click(screen.getByLabelText('configuration'));
            await waitFor(() => expect(screen.getByTitle('apitimeout-input')).toBeVisible()).then(
              () => {
                const APITimeoutInput = screen.getByTitle('apitimeout-input');
                fireEvent.click(APITimeoutInput);
                // select all digits in input
                fireEvent.change(screen.getByTitle(/apitimeout-input/i), {
                  target: { value: 5 },
                });
                fireEvent.change(screen.getByTitle(/apitimeout-input/i), {
                  target: { value: 60 },
                });
                fireEvent.change(screen.getByTitle(/apitimeout-input/i), {
                  target: { value: 30 },
                });
                expect(APITimeoutInput).toHaveValue(30);
              },
            );
          },
        );
      });
    });
  });

  it('enter value less than api timeout range, should display max range 5', async () => {
    setupMockAxiosSuccessResponses(mockedAxios);
    await act(async () => {
      render(<App />);
      const user = userEvent.setup();
      await waitFor(() => expect(screen.getByLabelText('menu')).toBeVisible()).then(async () => {
        const menuElement = screen.getByLabelText('menu');
        await user.click(menuElement);
        // wait for element to be rendered
        await waitFor(() => expect(screen.getByLabelText('configuration')).toBeVisible()).then(
          async () => {
            fireEvent.click(screen.getByLabelText('configuration'));
            await waitFor(() => expect(screen.getByTitle('apitimeout-input')).toBeVisible()).then(
              () => {
                const APITimeoutInput = screen.getByTitle('apitimeout-input');
                fireEvent.click(APITimeoutInput);

                fireEvent.change(screen.getByTitle(/apitimeout-input/i), {
                  target: { value: 1 },
                });

                expect(APITimeoutInput).toHaveValue(5);
              },
            );
          },
        );
      });
    });
  });

  it('enter value greater than api timeout range, should display max range 60', async () => {
    setupMockAxiosSuccessResponses(mockedAxios);
    await act(async () => {
      render(<App />);
      const user = userEvent.setup();
      await waitFor(() => expect(screen.getByLabelText('menu')).toBeVisible()).then(async () => {
        const menuElement = screen.getByLabelText('menu');
        await user.click(menuElement);
        // wait for element to be rendered
        await waitFor(() => expect(screen.getByLabelText('configuration')).toBeVisible()).then(
          async () => {
            fireEvent.click(screen.getByLabelText('configuration'));
            await waitFor(() => expect(screen.getByTitle('apitimeout-input')).toBeVisible()).then(
              () => {
                const APITimeoutInput = screen.getByTitle('apitimeout-input');
                fireEvent.click(APITimeoutInput);

                fireEvent.change(screen.getByTitle(/apitimeout-input/i), {
                  target: { value: 70 },
                });

                expect(APITimeoutInput).toHaveValue(60);
              },
            );
          },
        );
      });
    });
  });

  it('renders the API Timeout slider', async () => {
    setupMockAxiosSuccessResponses(mockedAxios);
    await act(async () => {
      render(<App />);
      await waitFor(() => expect(screen.getByLabelText('menu')).toBeVisible()).then(async () => {
        const menuElement = screen.getByLabelText('menu');
        fireEvent.click(menuElement);
        // wait for element to be rendered
        await waitFor(() => expect(screen.getByLabelText('configuration')).toBeVisible()).then(
          async () => {
            fireEvent.click(screen.getByLabelText('configuration'));
            await waitFor(() => expect(screen.getByLabelText('API Timeout')).toBeVisible()).then(
              () => {
                const APITimeoutMessages = screen.getByLabelText('API Timeout');
                fireEvent.mouseDown(APITimeoutMessages);
                expect(APITimeoutMessages).toBeTruthy();
              },
            );
          },
        );
      });
    });
  });
});

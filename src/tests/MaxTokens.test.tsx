import React from 'react';
import axios from 'axios';

import { render, cleanup, screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../App';
import { setupMockAxiosSuccessResponses } from './test-helper';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('testing Max Tokens', () => {
  afterEach(cleanup);

  it('enter value within the max tokens range, should display exact value', async () => {
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
            await waitFor(() => expect(screen.getByTitle('maxTokens-input')).toBeVisible()).then(
              () => {
                fireEvent.click(screen.getByTitle('maxTokens-input'));
                const maxtokensInput = screen.getByTitle('maxTokens-input');
                // select all digits in input
                fireEvent.change(screen.getByTitle(/maxTokens-input/i), {
                  target: { value: 2000 },
                });

                expect(maxtokensInput).toHaveValue(2000);
              },
            );
          },
        );
      });
    });
  });

  it('enter value less than max tokens range, should display max range 1', async () => {
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
            await waitFor(() => expect(screen.getByTitle('maxTokens-input')).toBeVisible()).then(
              () => {
                fireEvent.click(screen.getByTitle('maxTokens-input'));
                const maxtokensInput = screen.getByTitle('maxTokens-input');
                // select all digits in input
                fireEvent.change(screen.getByTitle(/maxTokens-input/i), {
                  target: { value: -1 },
                });

                expect(maxtokensInput).toHaveValue(1);
              },
            );
          },
        );
      });
    });
  });

  it('enter value greater than max tokens range, should display max range 4096', async () => {
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
            await waitFor(() => expect(screen.getByTitle('maxTokens-input')).toBeVisible()).then(
              () => {
                fireEvent.click(screen.getByTitle('maxTokens-input'));
                const maxtokensInput = screen.getByTitle('maxTokens-input');
                // select all digits in input
                fireEvent.change(screen.getByTitle(/maxTokens-input/i), {
                  target: { value: 5000 },
                });

                expect(maxtokensInput).toHaveValue(4096);
              },
            );
          },
        );
      });
    });
  });

  it('renders the Max Tokens slider', async () => {
    setupMockAxiosSuccessResponses(mockedAxios);
    await act(async () => {
      render(<App />);
      await waitFor(() => expect(screen.getByLabelText('menu')).toBeVisible()).then(async () => {
        const menuElement = screen.getByLabelText('menu');
        fireEvent.click(menuElement);
        // wait for element to be rendered
        await waitFor(() => expect(screen.getByLabelText('configuration')).toBeVisible(), {
          timeout: 10000,
        }).then(async () => {
          fireEvent.click(screen.getByLabelText('configuration'));
          await waitFor(() => expect(screen.getByLabelText('Max Tokens')).toBeVisible()).then(
            () => {
              const maxTokensElement = screen.getByLabelText('Max Tokens');
              fireEvent.mouseDown(maxTokensElement);
              expect(maxTokensElement).toBeTruthy();
            },
          );
        });
      });
    });
  });
});

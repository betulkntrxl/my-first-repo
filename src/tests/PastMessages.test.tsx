import React from 'react';
import axios from 'axios';

import { render, cleanup, screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../App';
import { setupMockAxiosSuccessResponses } from './test-helper';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('testing Past Messages', () => {
  afterEach(cleanup);

  it('enter value within the pastMessages range, should display exact value', async () => {
    setupMockAxiosSuccessResponses(mockedAxios);
    await act(async () => {
      render(<App />);
      const user = userEvent.setup();

      await waitFor(() => expect(screen.getByLabelText('open-menu')).toBeVisible()).then(
        async () => {
          const openMenuElement = screen.getByLabelText('open-menu');
          await user.click(openMenuElement);
          // wait for element to be rendered
          await waitFor(() => expect(screen.getByLabelText('configuration')).toBeVisible()).then(
            async () => {
              fireEvent.click(screen.getByLabelText('configuration'));
              await waitFor(() =>
                expect(screen.getByTitle('pastMessages-input')).toBeVisible(),
              ).then(() => {
                const previousMessagesInput = screen.getByTitle('pastMessages-input');
                fireEvent.click(previousMessagesInput);
                // select all digits in input
                fireEvent.change(screen.getByTitle(/pastMessages-input/i), {
                  target: { value: 10 },
                });
                expect(previousMessagesInput).toHaveValue(10);
              });
            },
          );
        },
      );
    });
  });

  it('enter value less than pastMessages range, should display max range 0', async () => {
    setupMockAxiosSuccessResponses(mockedAxios);
    await act(async () => {
      render(<App />);
      const user = userEvent.setup();

      await waitFor(() => expect(screen.getByLabelText('open-menu')).toBeVisible()).then(
        async () => {
          const openMenuElement = screen.getByLabelText('open-menu');
          await user.click(openMenuElement);
          // wait for element to be rendered
          await waitFor(() => expect(screen.getByLabelText('configuration')).toBeVisible()).then(
            async () => {
              fireEvent.click(screen.getByLabelText('configuration'));
              await waitFor(() =>
                expect(screen.getByTitle('pastMessages-input')).toBeVisible(),
              ).then(() => {
                const previousMessagesInput = screen.getByTitle('pastMessages-input');
                fireEvent.click(previousMessagesInput);
                // select all digits in input
                fireEvent.change(screen.getByTitle(/pastMessages-input/i), {
                  target: { value: -10 },
                });
                expect(previousMessagesInput).toHaveValue(0);
              });
            },
          );
        },
      );
    });
  });

  it('enter value greater than pastMessages range, should display max range 20', async () => {
    setupMockAxiosSuccessResponses(mockedAxios);
    await act(async () => {
      render(<App />);
      const user = userEvent.setup();

      await waitFor(() => expect(screen.getByLabelText('open-menu')).toBeVisible()).then(
        async () => {
          const openMenuElement = screen.getByLabelText('open-menu');
          await user.click(openMenuElement);
          // wait for element to be rendered
          await waitFor(() => expect(screen.getByLabelText('configuration')).toBeVisible()).then(
            async () => {
              fireEvent.click(screen.getByLabelText('configuration'));
              await waitFor(() =>
                expect(screen.getByTitle('pastMessages-input')).toBeVisible(),
              ).then(() => {
                const previousMessagesInput = screen.getByTitle('pastMessages-input');
                fireEvent.click(previousMessagesInput);
                // select all digits in input
                fireEvent.change(screen.getByTitle(/pastMessages-input/i), {
                  target: { value: 50 },
                });
                expect(previousMessagesInput).toHaveValue(20);
              });
            },
          );
        },
      );
    });
  });

  it('renders the Previous Messages slider', async () => {
    setupMockAxiosSuccessResponses(mockedAxios);
    await act(async () => {
      render(<App />);
      await waitFor(() => expect(screen.getByLabelText('open-menu')).toBeVisible()).then(
        async () => {
          const openMenuElement = screen.getByLabelText('open-menu');
          fireEvent.click(openMenuElement);
          // wait for element to be rendered
          await waitFor(() => expect(screen.getByLabelText('configuration')).toBeVisible()).then(
            async () => {
              fireEvent.click(screen.getByLabelText('configuration'));
              await waitFor(() =>
                expect(screen.getByLabelText('Past messages included')).toBeVisible(),
              ).then(() => {
                const previousMessages = screen.getByLabelText('Past messages included');
                fireEvent.mouseDown(previousMessages);
                expect(previousMessages).toBeTruthy();
              });
            },
          );
        },
      );
    });
  });
});

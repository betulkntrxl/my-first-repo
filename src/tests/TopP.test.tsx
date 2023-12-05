import React from 'react';
import axios from 'axios';

import { render, cleanup, screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../App';
import { setupMockAxiosSuccessResponses } from './test-helper';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('testing TopP', () => {
  afterEach(cleanup);

  it('enter value within the TopP range, should display exact value', async () => {
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
            await waitFor(() => expect(screen.getByTitle('topP-input')).toBeVisible()).then(() => {
              const toppInput = screen.getByTitle('topP-input');
              fireEvent.click(toppInput);
              // select all digits in input
              fireEvent.change(screen.getByTitle(/topP-input/i), {
                target: { value: 0.8 },
              });
              expect(toppInput).toHaveValue(0.8);
            });
          },
        );
      });
    });
  });

  it('enter value less than TopP range, should display max range 0', async () => {
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
            await waitFor(() => expect(screen.getByTitle('topP-input')).toBeVisible()).then(() => {
              const toppInput = screen.getByTitle('topP-input');
              fireEvent.click(toppInput);
              // select all digits in input
              fireEvent.change(screen.getByTitle(/topP-input/i), {
                target: { value: -1 },
              });
              expect(toppInput).toHaveValue(0);
            });
          },
        );
      });
    });
  });

  it('enter value greater than TopP range, should display max range 1', async () => {
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
            await waitFor(() => expect(screen.getByTitle('topP-input')).toBeVisible()).then(() => {
              const toppInput = screen.getByTitle('topP-input');
              fireEvent.click(toppInput);
              // select all digits in input
              fireEvent.change(screen.getByTitle(/topP-input/i), {
                target: { value: 2 },
              });
              expect(toppInput).toHaveValue(1);
            });
          },
        );
      });
    });
  });

  it('renders the Top P slider', async () => {
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
            await waitFor(() => expect(screen.getByLabelText('Top P')).toBeVisible()).then(() => {
              const topPElement = screen.getByLabelText('Top P');
              fireEvent.mouseDown(topPElement);
              expect(topPElement).toBeTruthy();
            });
          },
        );
      });
    });
  });
});

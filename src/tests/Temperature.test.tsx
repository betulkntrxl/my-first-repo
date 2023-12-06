import React from 'react';
import axios from 'axios';

import { render, cleanup, screen, waitFor, fireEvent, act } from '@testing-library/react';

import App from '../App';
import { setupMockAxiosSuccessResponses } from './test-helper';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('testing Temperature', () => {
  afterEach(cleanup);

  it('enter value within the Temperature range, should display exact value', async () => {
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

            await waitFor(() =>
              expect(screen.getByLabelText('temperature-input')).toBeVisible(),
            ).then(() => {
              const temperatureInput = screen.getByLabelText('temperature-input');
              fireEvent.click(temperatureInput);
              // select all digits in input
              fireEvent.change(screen.getByLabelText(/temperature-input/i), {
                target: { value: 0.5 },
              });

              expect(temperatureInput).toHaveValue(0.5);
            });
          },
        );
      });
    });
  });

  it('enter value less than Temperature range, should display max range 0', async () => {
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

            await waitFor(() =>
              expect(screen.getByLabelText('temperature-input')).toBeVisible(),
            ).then(() => {
              const temperatureInput = screen.getByLabelText('temperature-input');
              fireEvent.click(temperatureInput);
              // select all digits in input
              fireEvent.change(screen.getByLabelText(/temperature-input/i), {
                target: { value: -1 },
              });

              expect(temperatureInput).toHaveValue(0);
            });
          },
        );
      });
    });
  });

  it('enter value greater than Temperature range, should display max range 1', async () => {
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

            await waitFor(() =>
              expect(screen.getByLabelText('temperature-input')).toBeVisible(),
            ).then(() => {
              const temperatureInput = screen.getByLabelText('temperature-input');
              fireEvent.click(temperatureInput);
              // select all digits in input
              fireEvent.change(screen.getByLabelText(/temperature-input/i), {
                target: { value: 2 },
              });

              expect(temperatureInput).toHaveValue(1);
            });
          },
        );
      });
    });
  });

  it('renders the Temperature slider', async () => {
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
            await waitFor(() => expect(screen.getByLabelText('Temperature')).toBeVisible()).then(
              () => {
                fireEvent.mouseDown(screen.getByLabelText('Temperature'));
                const temperatureElement = screen.getByLabelText('Temperature');
                expect(temperatureElement).toBeTruthy();
              },
            );
          },
        );
      });
    });
  });
});

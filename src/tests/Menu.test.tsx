import React from 'react';
import axios from 'axios';

import { render, cleanup, screen, act, waitFor, fireEvent } from '@testing-library/react';

import App from '../App';
import { setupMockAxiosSuccessResponses } from './test-helper';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('testing the Menu', () => {
  afterEach(cleanup);

  it('opens a menu', async () => {
    setupMockAxiosSuccessResponses(mockedAxios);
    await act(async () => {
      render(<App />);

      await waitFor(() => expect(screen.getByLabelText('menu')).toBeVisible()).then(async () => {
        const menuElement = screen.getByLabelText('menu');
        fireEvent.click(menuElement);
        expect(menuElement).toBeTruthy();
      });
    });
  });
});

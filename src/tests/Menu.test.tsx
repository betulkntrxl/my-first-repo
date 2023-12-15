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

      await waitFor(() => expect(screen.getByLabelText('open-menu')).toBeVisible()).then(
        async () => {
          const openMenuElement = screen.getByLabelText('open-menu');
          fireEvent.click(openMenuElement);
          expect(openMenuElement).toBeTruthy();
        },
      );
    });
  });
});

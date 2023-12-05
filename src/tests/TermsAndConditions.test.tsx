import React from 'react';
import axios from 'axios';
import { render, cleanup, screen, waitFor, fireEvent, act } from '@testing-library/react';

import App from '../App';
import { setupMockAxiosSuccessResponses } from './test-helper';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Terms and Conditions', () => {
  afterEach(cleanup);

  it('If uson and not already accepted then show T&Cs', async () => {
    setupMockAxiosSuccessResponses(mockedAxios, 'uson');
    await act(async () => {
      render(<App />);
      await waitFor(() => expect(screen.getByTitle('reject-button')).toBeVisible()).then(
        async () => {
          const acceptButtonElement = screen.getByTitle('accept-button');

          expect(acceptButtonElement).toBeTruthy();
        },
      );
    });
  });

  // it('If mckesson then do not show T&Cs', async () => {
  //     setupMockAxiosSuccessResponses(mockedAxios, 'uson');
  //     await act(async () => {
  //         render(<App />);
  //         await waitFor(() => expect(screen.getByTitle('sendmessage')).toBeVisible()).then(async () => {
  //             expect(screen.queryByTitle('accept-button')).not.toBeInTheDocument();
  //         });
  //     });
  // });
});

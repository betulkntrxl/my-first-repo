import * as React from 'react';
import axios from 'axios';
import { render, fireEvent } from '@testing-library/react';
import { setupMockAxiosSuccessResponses } from './test-helper';
import DownloadConversation from '../components/DownloadConversation/DownloadConversation';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('DownloadConversation Tests', () => {
  it('Check download conversation components', async () => {
    setupMockAxiosSuccessResponses(mockedAxios);
    const { getByTestId } = render(<DownloadConversation />);
    expect(getByTestId('textIcon')).toBeInTheDocument();
    expect(getByTestId('downloadIcon')).toBeInTheDocument();
    fireEvent.click(getByTestId('textIcon'));
  });
});

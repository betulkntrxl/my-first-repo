import * as React from 'react';
import axios from 'axios';
import { render, cleanup, screen, waitFor, fireEvent, act } from '@testing-library/react';
import DownloadConversation from '../components/DownloadConversation/DownloadConversation';
import { downloadConversation } from '../components/DownloadConversation/DownloadUtils';
import { setupMockAxiosSuccessResponses } from './test-helper';

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

  it('should download correctly', () => {
    const mLink = {
      href: '',
      click: jest.fn(),
      download: '',
      style: { display: '' },
      setAttribute: jest.fn(),
    } as any;
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValueOnce(mLink);
    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();
    downloadConversation('blobUrl', 'go');
    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(mLink.setAttribute.mock.calls.length).toBe(2);
    expect(mLink.setAttribute.mock.calls[0]).toEqual(['href', 'data:text/plain;charset=utf-8,go']);
    expect(mLink.setAttribute.mock.calls[1]).toEqual(['download', 'blobUrl']);
    expect(mLink.style.display).toBe('none');
    expect(document.body.appendChild).toHaveBeenCalledWith(mLink);
    expect(mLink.click).toHaveBeenCalled();
    expect(document.body.removeChild).toHaveBeenCalledWith(mLink);
  });
});

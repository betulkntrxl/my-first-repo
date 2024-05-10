import * as React from 'react';
import { render, screen, within } from '@testing-library/react';
import { downloadConversation } from '../components/DownloadConversation/DownloadUtils';

describe('DownloadConversation', () => {
  it('checkdownload conversation', async () => {
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

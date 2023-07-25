import React from 'react';
import { render, cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from './App';

describe('testing the App', () => {
  afterEach(cleanup);

  it('sends a message', async () => {
    render(<App />);
    const user = userEvent.setup();
    const sendmessageElement = screen.getByTitle('sendmessage');
    await user.click(sendmessageElement);
    await user.keyboard('hello');
    const sendElement = screen.getByTitle('send');
    await user.click(sendElement);

    expect(sendElement).toBeTruthy();
  }, 20000);

  it('renders a menu', async () => {
    render(<App />);
    const menu = screen.getByLabelText('menu');
    expect(menu).toBeTruthy();
  });
  it('renders a Message input', () => {
    render(<App />);
    const textareaNode = screen.getByPlaceholderText('Type your message here.');
    expect(textareaNode).toBeTruthy();
  });
  it('renders a Token Count', () => {
    render(<App />);
    const tokenCount = screen.getByText(/Token Count:/);
    expect(tokenCount).toBeTruthy();
  });
});

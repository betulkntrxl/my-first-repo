import React from 'react';
import { render, cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from './App';

describe('testing the App', () => {
  afterEach(cleanup);

  it('renders a menu', () => {
    render(<App />);
    const menu = screen.getByLabelText('menu');
    expect(menu).toBeTruthy();
  });
  it('opens a menu', async () => {
    render(<App />);
    const user = userEvent.setup();
    const menuElement = screen.getByLabelText('menu');
    await user.click(menuElement);
    expect(menuElement).toBeTruthy();
  });

  it('renders a Temperature slider', () => {
    render(<App />);
    const temperature = screen.getByLabelText('Temperature');
    expect(temperature).toBeTruthy();
  });
  it('renders a Top P slider', () => {
    render(<App />);
    const topP = screen.getByLabelText('Top P');
    expect(topP).toBeTruthy();
  });
  it('renders a Max Tokens slider', () => {
    render(<App />);
    const maxTokens = screen.getByLabelText('Max Tokens');
    expect(maxTokens).toBeTruthy();
  });
  it('renders a Max Tokens slider', () => {
    render(<App />);
    const textareaNode = screen.getByPlaceholderText('Type your message here.');
    expect(textareaNode).toBeTruthy();
  });
  it('renders a Max Tokens slider', () => {
    render(<App />);
    const tokenCount = screen.getByText(/Token Count:/);
    expect(tokenCount).toBeTruthy();
  });
  it('sends a message', async () => {
    render(<App />);
    const user = userEvent.setup();
    await user.keyboard('hello');
    const sendElement = screen.getByTitle('send');
    await user.click(sendElement);
    const tokenCount = screen.getByText(/Token Count:/);
    expect(tokenCount).toBeTruthy();
  });
});

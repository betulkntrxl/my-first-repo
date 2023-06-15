import React from 'react';
import { render, cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from './App';

describe('testing the App', () => {
  afterEach(cleanup);

  it('opens a menu', async () => {
    render(<App />);
    const user = userEvent.setup();
    const menuElement = screen.getByLabelText('menu');
    await user.click(menuElement);
    expect(menuElement).toBeTruthy();
  }, 20000);

  it('renders a Temperature slider', async () => {
    render(<App />);
    const user = userEvent.setup();
    const menuElement = screen.getByLabelText('menu');
    await user.click(menuElement);
    const temperature = screen.getByLabelText('Temperature');
    expect(temperature).toBeTruthy();
  });
  it('renders a Top P slider', async () => {
    render(<App />);
    const user = userEvent.setup();
    const menuElement = screen.getByLabelText('menu');
    await user.click(menuElement);
    const topP = screen.getByLabelText('Top P');
    expect(topP).toBeTruthy();
  });
  it('renders a Max Tokens slider', async () => {
    render(<App />);
    const user = userEvent.setup();
    const menuElement = screen.getByLabelText('menu');
    await user.click(menuElement);
    const maxTokens = screen.getByLabelText('Max Tokens');
    expect(maxTokens).toBeTruthy();
  });
});

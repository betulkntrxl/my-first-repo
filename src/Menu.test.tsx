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
  it('renders a Temperature input', async () => {
    render(<App />);
    const user = userEvent.setup();
    const menuElement = screen.getByLabelText('menu');
    await user.click(menuElement);
    const temperatureInput = screen.getByTitle('temperature-input');
    expect(temperatureInput).toBeTruthy();
  });
  it('renders a Top P slider', async () => {
    render(<App />);
    const user = userEvent.setup();
    const menuElement = screen.getByLabelText('menu');
    await user.click(menuElement);
    const topP = screen.getByLabelText('Top P');
    expect(topP).toBeTruthy();
  });
  it('renders a TopP input', async () => {
    render(<App />);
    const user = userEvent.setup();
    const menuElement = screen.getByLabelText('menu');
    await user.click(menuElement);
    const toppInput = screen.getByTitle('topP-input');
    expect(toppInput).toBeTruthy();
  });
  it('renders a Max Tokens slider', async () => {
    render(<App />);
    const user = userEvent.setup();
    const menuElement = screen.getByLabelText('menu');
    await user.click(menuElement);
    const maxTokens = screen.getByLabelText('Max Tokens');
    expect(maxTokens).toBeTruthy();
  });
  it('renders a MaxTokens input', async () => {
    render(<App />);
    const user = userEvent.setup();
    const menuElement = screen.getByLabelText('menu');
    await user.click(menuElement);
    const maxtokensInput = screen.getByTitle('maxTokens-input');
    expect(maxtokensInput).toBeTruthy();
  });
  it('renders a Previous Messages slider', async () => {
    render(<App />);
    const user = userEvent.setup();
    const menuElement = screen.getByLabelText('menu');
    await user.click(menuElement);
    const previousMessages = screen.getByLabelText('Past messages included');
    expect(previousMessages).toBeTruthy();
  });
  it('renders a previousMessages input', async () => {
    render(<App />);
    const user = userEvent.setup();
    const menuElement = screen.getByLabelText('menu');
    await user.click(menuElement);
    const previousMessagesInput = screen.getByTitle('pastMessages-input');
    expect(previousMessagesInput).toBeTruthy();
  });
});

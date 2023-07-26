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
  it('renders a Temperature input and tests valid input', async () => {
    render(<App />);
    const user = userEvent.setup();
    const menuElement = screen.getByLabelText('menu');
    await user.click(menuElement);
    const configurationElement = screen.getByLabelText('configuration');
    await user.click(configurationElement);
    const temperatureInput = screen.getByTitle('temperature-input');
    await user.click(temperatureInput);
    await user.keyboard('.5');
    expect(temperatureInput).toBeTruthy();
  });
  it('renders a Temperature input and tests invalid input less than zero', async () => {
    render(<App />);
    const user = userEvent.setup();
    const menuElement = screen.getByLabelText('menu');
    await user.click(menuElement);
    const configurationElement = screen.getByLabelText('configuration');
    await user.click(configurationElement);
    const temperatureInput = screen.getByTitle('temperature-input');
    await user.click(temperatureInput);
    await user.keyboard('-1');
    expect(temperatureInput).toBeTruthy();
  });

  it('renders a Temperature input and tests invalid input greater than one', async () => {
    render(<App />);
    const user = userEvent.setup();
    const menuElement = screen.getByLabelText('menu');
    await user.click(menuElement);
    const configurationElement = screen.getByLabelText('configuration');
    await user.click(configurationElement);
    const temperatureInput = screen.getByTitle('temperature-input');
    await user.click(temperatureInput);
    await user.keyboard('2');
    expect(temperatureInput).toBeTruthy();
  });

  it('renders a Top P slider', async () => {
    render(<App />);
    const user = userEvent.setup();
    const menuElement = screen.getByLabelText('menu');
    await user.click(menuElement);
    const configurationElement = screen.getByLabelText('configuration');
    await user.click(configurationElement);
    const topP = screen.getByLabelText('Top P');
    expect(topP).toBeTruthy();
  });

  it('renders a TopP input and tests for valid input', async () => {
    render(<App />);
    const user = userEvent.setup();
    const menuElement = screen.getByLabelText('menu');
    await user.click(menuElement);
    const configurationElement = screen.getByLabelText('configuration');
    await user.click(configurationElement);
    const toppInput = screen.getByTitle('topP-input');
    await user.click(toppInput);
    await user.keyboard('.8');
    expect(toppInput).toBeTruthy();
  });

  it('renders a TopP input and tests for invalid input less than 1', async () => {
    render(<App />);
    const user = userEvent.setup();
    const menuElement = screen.getByLabelText('menu');
    await user.click(menuElement);
    const configurationElement = screen.getByLabelText('configuration');
    await user.click(configurationElement);
    const toppInput = screen.getByTitle('topP-input');
    await user.click(toppInput);
    await user.keyboard('-1');
    expect(toppInput).toBeTruthy();
  });

  it('renders a TopP input and tests for invalid input greater than 1', async () => {
    render(<App />);
    const user = userEvent.setup();
    const menuElement = screen.getByLabelText('menu');
    await user.click(menuElement);
    const configurationElement = screen.getByLabelText('configuration');
    await user.click(configurationElement);
    const toppInput = screen.getByTitle('topP-input');
    await user.click(toppInput);
    await user.keyboard('2');
    expect(toppInput).toBeTruthy();
  });

  it('renders a Max Tokens slider', async () => {
    render(<App />);
    const user = userEvent.setup();
    const menuElement = screen.getByLabelText('menu');
    await user.click(menuElement);
    const configurationElement = screen.getByLabelText('configuration');
    await user.click(configurationElement);
    const maxTokens = screen.getByLabelText('Max Tokens');
    expect(maxTokens).toBeTruthy();
  });

  it('renders a MaxTokens input and tests for valid input', async () => {
    render(<App />);
    const user = userEvent.setup();
    const menuElement = screen.getByLabelText('menu');
    await user.click(menuElement);
    const configurationElement = screen.getByLabelText('configuration');
    await user.click(configurationElement);
    const maxtokensInput = screen.getByTitle('maxTokens-input');
    await user.click(maxtokensInput);
    await user.keyboard('200');
    expect(maxtokensInput).toBeTruthy();
  });

  it('renders a MaxTokens input and tests for invalid input less than zero', async () => {
    render(<App />);
    const user = userEvent.setup();
    const menuElement = screen.getByLabelText('menu');
    await user.click(menuElement);
    const configurationElement = screen.getByLabelText('configuration');
    await user.click(configurationElement);
    const maxtokensInput = screen.getByTitle('maxTokens-input');
    await user.click(maxtokensInput);
    await user.keyboard('-1');
    expect(maxtokensInput).toBeTruthy();
  });

  it('renders a MaxTokens input and tests for input greater than 4096', async () => {
    render(<App />);
    const user = userEvent.setup();
    const menuElement = screen.getByLabelText('menu');
    await user.click(menuElement);
    const configurationElement = screen.getByLabelText('configuration');
    await user.click(configurationElement);
    const maxtokensInput = screen.getByTitle('maxTokens-input');
    await user.click(maxtokensInput);
    await user.keyboard('5000');
    expect(maxtokensInput).toBeTruthy();
  });

  it('renders a Previous Messages slider', async () => {
    render(<App />);
    const user = userEvent.setup();
    const menuElement = screen.getByLabelText('menu');
    await user.click(menuElement);
    const configurationElement = screen.getByLabelText('configuration');
    await user.click(configurationElement);
    const previousMessages = screen.getByLabelText('Past messages included');
    expect(previousMessages).toBeTruthy();
  });

  it('renders a previousMessages input', async () => {
    render(<App />);
    const user = userEvent.setup();
    const menuElement = screen.getByLabelText('menu');
    await user.click(menuElement);
    const configurationElement = screen.getByLabelText('configuration');
    await user.click(configurationElement);
    const previousMessagesInput = screen.getByTitle('pastMessages-input');
    await user.click(previousMessagesInput);
    await user.keyboard('1');
    expect(previousMessagesInput).toBeTruthy();
  });

  it('renders a previousMessages input and tests for input less than 0', async () => {
    render(<App />);
    const user = userEvent.setup();
    const menuElement = screen.getByLabelText('menu');
    await user.click(menuElement);
    const configurationElement = screen.getByLabelText('configuration');
    await user.click(configurationElement);
    const previousMessagesInput = screen.getByTitle('pastMessages-input');
    await user.click(previousMessagesInput);
    await user.keyboard('-1');
    expect(previousMessagesInput).toBeTruthy();
  });

  it('renders a previousMessages input and tests for input greater than 20', async () => {
    render(<App />);
    const user = userEvent.setup();
    const menuElement = screen.getByLabelText('menu');
    await user.click(menuElement);
    const configurationElement = screen.getByLabelText('configuration');
    await user.click(configurationElement);
    const previousMessagesInput = screen.getByTitle('pastMessages-input');
    await user.click(previousMessagesInput);
    await user.keyboard('30');
    expect(previousMessagesInput).toBeTruthy();
  });
});

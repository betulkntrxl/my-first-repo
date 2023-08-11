import React from 'react';
import { render, cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from './App';

const server = setupServer(
  rest.get('/api/version', (req, res, ctx) => res(ctx.json({ greeting: 'hello there' }))),
  rest.get('/api/app-insights-event', (req, res, ctx) => res(ctx.status(201))),
  rest.get('/api/app-insights-trace', (req, res, ctx) => res(ctx.status(201))),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

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
    const temperatureElement = screen.getByLabelText('Temperature');
    await user.click(temperatureElement);
    expect(temperatureElement).toBeTruthy();
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
    // select all digits in input
    await user.keyboard('{Control>}a{/Control}');
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
    // select all digits in input
    await user.keyboard('{Control>}a{/Control}');
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
    // select all digits in input
    await user.keyboard('{Control>}a{/Control}');
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
    const topPElement = screen.getByLabelText('Top P');
    await user.click(topPElement);
    expect(topPElement).toBeTruthy();
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
    // select all digits in input
    await user.keyboard('{Control>}a{/Control}');
    await user.keyboard('0.8');
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
    // select all digits in input
    await user.keyboard('{Control>}a{/Control}');
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
    // select all digits in input
    await user.keyboard('{Control>}a{/Control}');
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
    const maxTokensElement = screen.getByLabelText('Max Tokens');
    await user.click(maxTokensElement);
    expect(maxTokensElement).toBeTruthy();
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
    // select all digits in input
    await user.keyboard('{Control>}a{/Control}');
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
    // select all digits in input
    await user.keyboard('{Control>}a{/Control}');
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
    // select all digits in input
    await user.keyboard('{Control>}a{/Control}');
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
    await user.click(previousMessages);
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
    // select all digits in input
    await user.keyboard('{Control>}a{/Control}');
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
    // select all digits in input
    await user.keyboard('{Control>}a{/Control}');
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
    // select all digits in input
    await user.keyboard('{Control>}a{/Control}');
    await user.keyboard('30');
    expect(previousMessagesInput).toBeTruthy();
  });

  it('renders an API Timeout slider', async () => {
    render(<App />);
    const user = userEvent.setup();
    const menuElement = screen.getByLabelText('menu');
    await user.click(menuElement);
    const configurationElement = screen.getByLabelText('configuration');
    await user.click(configurationElement);
    const APITimeoutMessages = screen.getByLabelText('API Timeout');
    await user.click(APITimeoutMessages);
    expect(APITimeoutMessages).toBeTruthy();
  });

  it('renders an API Timeout input and tests for input less than 5 and greater than 60', async () => {
    render(<App />);
    const user = userEvent.setup();
    const menuElement = screen.getByLabelText('menu');
    await user.click(menuElement);
    const configurationElement = screen.getByLabelText('configuration');
    await user.click(configurationElement);
    const APITimeoutInput = screen.getByTitle('apitimeout-input');
    await user.click(APITimeoutInput);
    // select all digits in input
    await user.keyboard('{Control>}a{/Control}');
    await user.keyboard('4');
    await user.keyboard('{Control>}a{/Control}');
    await user.keyboard('70');
    expect(APITimeoutInput).toBeTruthy();
  });

  it('renders a System Message input and tests for input', async () => {
    render(<App />);
    const user = userEvent.setup();
    const menuElement = screen.getByLabelText('menu');
    await user.click(menuElement);
    const systemMessageInput = screen.getByTitle('system-message-input');
    await user.click(systemMessageInput);
    // select all digits in input
    await user.keyboard('{Control>}a{/Control}');
    await user.keyboard('test');
    expect(systemMessageInput).toBeTruthy();
  });
});

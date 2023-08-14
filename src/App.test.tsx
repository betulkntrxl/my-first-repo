import React from 'react';
import { render, cleanup, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from './App';

const server = setupServer(
  rest.post('/api/prompt', (req, res, ctx) =>
    res(
      ctx.json({
        id: 'chatcmpl-7gQM4JDiQa2Dc4dErFzWLnTfD0dYR',
        object: 'chat.completion',
        created: 1690345440,
        model: 'gpt-35-turbo',
        choices: [
          {
            index: 0,
            finish_reason: 'stop',
            message: {
              role: 'assistant',
              content: 'Hello! How can I assist you today?',
            },
          },
        ],
        usage: {
          completion_tokens: 9,
          prompt_tokens: 25,
          total_tokens: 34,
        },
      }),
    ),
  ),
  rest.get('/api/version', (req, res, ctx) => res(ctx.json({ greeting: 'hello there' }))),
  rest.post('/api/app-insights-event', (req, res, ctx) => res(ctx.status(201))),
  rest.post('/api/app-insights-trace', (req, res, ctx) => res(ctx.status(201))),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('testing the App', () => {
  afterEach(cleanup);

  it('sends a message by clicking on Send button and returns status 200 ok', async () => {
    render(<App />);
    const user = userEvent.setup();
    const sendmessageElement = screen.getByTitle('sendmessage');
    await act(async () => {
      await user.click(sendmessageElement);
      await user.keyboard('hello');
      const sendElement = screen.getByTitle('send');
      await user.click(sendElement);

      expect(sendElement).toBeTruthy();
    });
  }, 5000);

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

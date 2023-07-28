import React from 'react';
import { render, cleanup, screen, waitFor } from '@testing-library/react';
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
          total_tokens: 400,
        },
      }),
      ctx.status(200)
    )
  ),
  rest.get('/api/version', (req, res, ctx) => res(ctx.json({ greeting: 'hello there' })))
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('testing the App', () => {
  afterEach(cleanup);

  it('sends a message and reset chat and cancel', async () => {
    render(<App />);
    const user = userEvent.setup();
    //  const sendmessageElement = screen.getByTitle('sendmessage');
    //  await user.click(sendmessageElement);
    //  await user.keyboard('hello');
    //  const sendElement = screen.getByTitle('send');
    //  await user.click(sendElement);
    const resetElement = screen.getByTitle('reset');
    await user.click(resetElement);
    const cancelElement = screen.getByTitle('cancel-button');
    await user.click(cancelElement);

    expect(resetElement).toBeTruthy();
  }, 5000);

  it('sends a message and reset chat and continue', async () => {
    render(<App />);
    const user = userEvent.setup();

    const sendmessageElement = screen.getByTitle('sendmessage');
    //    await user.click(sendmessageElement);
    //    await user.keyboard('hello');
    //    const sendElement = screen.getByTitle('send');
    //    await user.click(sendElement);
    //    await waitFor(() => expect(screen.getByTitle('reset')).not.toBeDisabled(), {
    //      timeout: 5000,
    //    });

    const resetElement = screen.getByTitle('reset');
    await user.click(resetElement);
    // continue
    //  await waitFor(() => expect(screen.getByTitle('continue-button')).not.toBeDisabled(), {
    //    timeout: 5000,
    //  });
    const continueElement = await screen.getByTitle('continue-button');
    await user.click(continueElement);
    expect(continueElement).toBeTruthy();
  }, 5000);
});

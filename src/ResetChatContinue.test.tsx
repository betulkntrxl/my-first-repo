import React from 'react';
import { render, cleanup, screen, waitFor, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from './App';

const server = setupServer(
  rest.get('/api/auth/isAuthenticated', (req, res, ctx) =>
    res(ctx.json({ authenticated: 'true' })),
  ),
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
      ctx.status(200),
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

  it('sends a message and reset chat and continue', async () => {
    await act(async () => {
      render(<App />);
      const user = userEvent.setup();

      await waitFor(() => expect(screen.getByTitle('reset')).toBeVisible()).then(async () => {
        const resetElement = screen.getByTitle('reset');

        await user.click(resetElement);
        // wait for element to be rendered
        await waitFor(() => expect(screen.getByTitle('continue-button')).toBeVisible()).then(() => {
          const continueElement = screen.getByTitle('continue-button');
          fireEvent.click(continueElement);
          expect(continueElement).toBeTruthy();
        });
      });
    });
  });
});

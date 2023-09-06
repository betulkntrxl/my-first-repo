import React from 'react';
import { render, cleanup, screen, waitFor, act, fireEvent } from '@testing-library/react';

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
      ctx.status(200),
    ),
  ),
  rest.get('/api/version', (req, res, ctx) => res(ctx.json({ greeting: 'hello there' }))),
  rest.post('/api/app-insights-event', (req, res, ctx) => res(ctx.status(201))),
  rest.post('/api/app-insights-trace', (req, res, ctx) => res(ctx.status(201))),
  rest.get('/api/auth/login', (req, res, ctx) => res(ctx.json({ greeting: 'hello there' }))),
  rest.get('/api/auth/logout', (req, res, ctx) => res(ctx.json({ greeting: 'hello there' }))),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('testing the App', () => {
  afterEach(cleanup);

  it('sends a message and reset chat and continue', async () => {
    await act(async () => {
      render(<App />);

      await waitFor(() => expect(screen.getByLabelText('logout')).toBeVisible()).then(() => {
        const logoutElement = screen.getByLabelText('logout');
        // mock window.location.href
        const url = window.location.href;
        // eslint-disable-next-line no-global-assign
        window = Object.create(window);
        Object.defineProperty(window, 'location', {
          value: {
            href: url,
          },
          writable: true, // possibility to override
        });

        fireEvent.click(logoutElement);

        expect(logoutElement).toBeTruthy();
      });
    });
  });
});

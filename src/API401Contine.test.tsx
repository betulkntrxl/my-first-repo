import React from 'react';
import { render, cleanup, screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from './App';

const server = setupServer(
  rest.post('/api/prompt', (req, res, ctx) =>
    res(
      ctx.json({ errorMessage: 'User is not logged in, authenticate path is /api/auth/login' }),
      ctx.status(401),
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

  it('sends a message and returns status 401 Unauthorized error and Continue', async () => {
    await act(async () => {
      render(<App />);
      const user = userEvent.setup();
      const sendmessageElement = screen.getByTitle('sendmessage');

      await user.click(sendmessageElement);
      await user.keyboard('hello');
      const sendElement = screen.getByTitle('send');
      await user.click(sendElement);

      // wait for dialog to be rendered
      await waitFor(() => expect(screen.getByTitle('continue-button')).toBeVisible()).then(() => {
        fireEvent.click(screen.getByTitle('continue-button'));
      });
      expect(sendElement).toBeTruthy();
    });
  });
});

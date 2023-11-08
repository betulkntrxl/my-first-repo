import React from 'react';
import { render, cleanup, screen, waitFor, fireEvent, act } from '@testing-library/react';

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from './App';

const server = setupServer(
  rest.get('/api/auth/isAuthenticated', (req, res, ctx) => res(ctx.status(200))),
  rest.get('/api/version', (req, res, ctx) => res(ctx.json({ greeting: 'hello there' }))),
  rest.post('/api/app-insights-event', (req, res, ctx) => res(ctx.status(201))),
  rest.post('/api/app-insights-trace', (req, res, ctx) => res(ctx.status(201))),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('testing Token Limit', () => {
  afterEach(cleanup);

  it('sends a message which is too large and returns too large error message', async () => {
    await act(async () => {
      render(<App />);
      await waitFor(() => expect(screen.getByTitle('sendmessage')).toBeVisible()).then(async () => {
        const sendmessageElement = screen.getByTitle('sendmessage');

        fireEvent.click(sendmessageElement);
        fireEvent.change(sendmessageElement, {
          // For file readability TOO_MUCH_TEXT is defined at the end of this file
          /* eslint-disable */
          target: { value: TOO_MUCH_TEXT },
          /* eslint-enable */
        });
        // await user.keyboard('hello');
        const sendElement = screen.getByTitle('send');
        fireEvent.click(sendElement);

        // wait for dialog to be rendered
        await waitFor(() => expect(screen.getByTitle('close-button')).toBeVisible()).then(() => {
          fireEvent.click(screen.getByTitle('close-button'));
          expect(sendElement).toBeTruthy();
        });
      });
    });
  });
});

/* eslint-disable */
const TOO_MUCH_TEXT =
  'Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text Too much text ';
/* eslint-enable */

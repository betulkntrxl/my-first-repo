import React from 'react';
import { render, cleanup, screen, waitFor, fireEvent, act } from '@testing-library/react';

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from './App';

const server = setupServer(
  rest.get('/api/auth/isAuthenticated', (req, res, ctx) => res(ctx.status(200))),
  rest.post('/api/prompt', (req, res, ctx) =>
    res(ctx.json({ errorMessage: 'an error has occured' }), ctx.status(500)),
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

  it('renders a System Message input and tests for input', async () => {
    act(() => {
      render(<App />);
    });
    await waitFor(() => expect(screen.getByLabelText('menu')).toBeVisible()).then(async () => {
      const menuElement = screen.getByLabelText('menu');
      act(() => {
        fireEvent.click(menuElement);
      });
      // wait for dialog to be rendered
      await waitFor(() => expect(screen.getByTitle('system-message-input')).toBeVisible()).then(
        () => {
          // fireEvent.click(screen.getByTitle('system-message-input'));
          const systemMessageInput = screen.getByTitle('system-message-input');
          // select all digits in input
          act(() => {
            fireEvent.change(systemMessageInput, {
              target: { label: 'template1' },
            });
          });
          // user.keyboard('{Control>}a{/Control}');
          // user.keyboard('test');
          expect(systemMessageInput).toBeTruthy();
        },
      );
    });
  });
});

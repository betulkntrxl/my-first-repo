import React from 'react';
import { render, cleanup, screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from './App';

const server = setupServer(
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
    render(<App />);
    const user = userEvent.setup();
    await act(async () => {
      const menuElement = screen.getByLabelText('menu');
      await user.click(menuElement);

      // wait for dialog to be rendered
      await waitFor(() => expect(screen.getByTitle('system-message-input')).toBeVisible(), {
        timeout: 10000,
      }).then(() => {
        fireEvent.click(screen.getByTitle('system-message-input'));
        const systemMessageInput = screen.getByTitle('system-message-input');
        // select all digits in input
        user.keyboard('{Control>}a{/Control}');
        user.keyboard('test');
        expect(systemMessageInput).toBeTruthy();
      });
    });
  });
});

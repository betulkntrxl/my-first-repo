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

  it('renders a System Message Template dropdown and tests selection', async () => {
    await act(async () => {
      render(<App />);
      const user = userEvent.setup();
      await waitFor(() => expect(screen.getByLabelText('menu')).toBeVisible()).then(async () => {
        const menuElement = screen.getByLabelText('menu');
        fireEvent.click(menuElement);

        // wait for dialog to be rendered
        await waitFor(() =>
          expect(screen.getByLabelText('system-message-template')).toBeVisible(),
        ).then(async () => {
          const systemMessageTemplate = screen.getByLabelText('system-message-template');
          // fireEvent.click(systemMessageTemplate);
          fireEvent.focus(systemMessageTemplate);
          fireEvent.keyDown(systemMessageTemplate, { keyCode: 13 });
          fireEvent.keyDown(systemMessageTemplate, { key: 'ArrowDown', code: 40 });
          await waitFor(() => screen.getByText('as an assistant'));
          fireEvent.click(screen.getByText('as an assistant'));
          // fireEvent.keyDown(systemMessageTemplate, { keyCode: 13 });
          // fireEvent.click(screen.getByText('as a agent understanding the sentiment'));
          // select all digits in input
          // fireEvent.click(screen.getByText('as an assistant'));
          // user.keyboard('{Control>}a{/Control}');
          // user.keyboard('test');
          expect(systemMessageTemplate).toBeTruthy();
        });
      });
    });
  });
});

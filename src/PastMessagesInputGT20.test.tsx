import React from 'react';
import { render, cleanup, screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from './App';

const server = setupServer(
  rest.get('/api/version', (req, res, ctx) => res(ctx.json({ greeting: 'hello there' }))),
  rest.post('/api/app-insights-event', (req, res, ctx) => res(ctx.status(201))),
  rest.post('/api/app-insights-trace', (req, res, ctx) => res(ctx.status(201))),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('testing the App', () => {
  afterEach(cleanup);

  it('renders a previousMessages input and tests for input greater than 20', async () => {
    render(<App />);
    const user = userEvent.setup();
    await act(async () => {
      const menuElement = screen.getByLabelText('menu');
      await user.click(menuElement);
      // wait for element to be rendered
      await waitFor(() => expect(screen.getByLabelText('configuration')).toBeVisible()).then(
        async () => {
          fireEvent.click(screen.getByLabelText('configuration'));
          await waitFor(() => expect(screen.getByTitle('pastMessages-input')).toBeVisible()).then(
            () => {
              fireEvent.click(screen.getByTitle('pastMessages-input'));
              const previousMessagesInput = screen.getByTitle('pastMessages-input');
              // select all digits in input
              user.keyboard('{Control>}a{/Control}');
              user.keyboard('30');
              expect(previousMessagesInput).toBeTruthy();
            },
          );
        },
      );
    });
  });
});

import React from 'react';
import { render, cleanup, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from '../App';

const server = setupServer(
  rest.get('/api/auth/isAuthenticated', (req, res, ctx) =>
    res(ctx.json({ authenticated: 'true' })),
  ),
  rest.get('/api/version', (req, res, ctx) => res(ctx.json({ greeting: 'hello there' }))),
  rest.get('/api/org-deployment', (req, res, ctx) => res(ctx.json({ orgDeployment: 'mckesson' }))),
  rest.post('/api/app-insights-event', (req, res, ctx) => res(ctx.status(201))),
  rest.post('/api/app-insights-trace', (req, res, ctx) => res(ctx.status(201))),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('testing the App', () => {
  afterEach(cleanup);
  beforeEach(cleanup);

  it('renders a Temperature input and tests valid input', async () => {
    await act(async () => {
      render(<App />);

      await waitFor(() => expect(screen.getByLabelText('menu')).toBeVisible()).then(async () => {
        const menuElement = screen.getByLabelText('menu');
        fireEvent.click(menuElement);

        // wait for element to be rendered
        await waitFor(() => expect(screen.getByLabelText('configuration')).toBeVisible()).then(
          async () => {
            fireEvent.click(screen.getByLabelText('configuration'));

            await waitFor(() =>
              expect(screen.getByLabelText('temperature-input')).toBeVisible(),
            ).then(() => {
              const temperatureInput = screen.getByLabelText('temperature-input');
              fireEvent.click(temperatureInput);
              // select all digits in input
              fireEvent.change(screen.getByLabelText(/temperature-input/i), {
                target: { value: 0.5 },
              });
              // await user.keyboard('{Control>}a{/Control}');
              // await user.keyboard('.5');
              expect(temperatureInput).toBeTruthy();
            });
          },
        );
      });
    });
  });
});

import React from 'react';
import { render, cleanup, screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from './App';

const server = setupServer(
  rest.get('/api/auth/isAuthenticated', (req, res, ctx) =>
    res(ctx.json({ authenticated: 'true' })),
  ),
  rest.get('/api/version', (req, res, ctx) => res(ctx.json({ greeting: 'hello there' }))),
  rest.get('/api/org-deployment', (req, res, ctx) => res(ctx.json({ orgDeployment: 'mckesson' }))),
  rest.get('/get', (req, res, ctx) => res(ctx.json({ greeting: 'hello there' }))),
  rest.post('/api/app-insights-event', (req, res, ctx) => res(ctx.status(201))),
  rest.post('/api/app-insights-trace', (req, res, ctx) => res(ctx.status(201))),
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
          total_tokens: 34,
        },
      }),
    ),
  ),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('testing the App', () => {
  afterEach(cleanup);

  it('renders a previousMessages input and sends a message', async () => {
    act(() => {
      render(<App />);
    });

    const user = userEvent.setup();

    await waitFor(() => expect(screen.getByLabelText('menu')).toBeVisible()).then(async () => {
      const menuElement = screen.getByLabelText('menu');

      await act(async () => {
        await user.click(menuElement);
      });
      // wait for element to be rendered
      await waitFor(() => expect(screen.getByLabelText('configuration')).toBeVisible()).then(
        async () => {
          fireEvent.click(screen.getByLabelText('configuration'));
          await waitFor(() => expect(screen.getByTitle('pastMessages-input')).toBeVisible()).then(
            async () => {
              const previousMessagesInput = screen.getByTitle('pastMessages-input');
              fireEvent.click(previousMessagesInput);
              // select all digits in input
              act(() => {
                fireEvent.change(screen.getByTitle(/pastMessages-input/i), {
                  target: { value: 1 },
                });
              });
              // close menu
              act(() => {
                fireEvent.click(menuElement);
              });
              // wait for message box
              await waitFor(() => expect(screen.getByTitle('sendmessage')).toBeVisible()).then(
                async () => {
                  const sendmessageElement = screen.getByTitle('sendmessage');
                  act(() => {
                    fireEvent.click(sendmessageElement);
                  });
                  // type message
                  act(() => {
                    fireEvent.change(sendmessageElement, {
                      target: { value: 'hi' },
                    });
                  });
                  // send message
                  const sendElement = screen.getByTitle('send');
                  await act(async () => {
                    fireEvent.click(sendElement);
                  });
                  // user.keyboard('{Control>}a{/Control}');
                  // user.keyboard('1');
                  expect(previousMessagesInput).toBeTruthy();
                },
              );
            },
          );
        },
      );
    });
  });
});

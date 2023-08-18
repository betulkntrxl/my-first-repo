import React from 'react';
import { render, cleanup, screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from './App';

function wait(milliseconds: number | undefined) {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });
}

const server = setupServer(
  rest.post('/api/prompt', (req, res, ctx) => {
    wait(11000);
    return res(ctx.json({ greeting: "I'm late" }));
  }),
  rest.get('/api/version', (req, res, ctx) => res(ctx.json({ greeting: 'hello there' }))),
  rest.post('/api/app-insights-event', (req, res, ctx) => res(ctx.status(201))),
  rest.post('/api/app-insights-trace', (req, res, ctx) => res(ctx.status(201))),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('testing the App', () => {
  afterEach(cleanup);
  jest.setTimeout(35000);
  it('sends a message and returns API error', async () => {
    act(() => {
      render(<App />);
    });
    const user = userEvent.setup();
    await waitFor(() => expect(screen.getByTitle('sendmessage')).toBeVisible()).then(async () => {
      const sendmessageElement = screen.getByTitle('sendmessage');

      fireEvent.click(sendmessageElement);
      act(() => {
        fireEvent.change(sendmessageElement, {
          target: { value: 'hello' },
        });
      });
      // await user.keyboard('hello');
      await waitFor(() => expect(screen.getByTitle('send')).toBeVisible()).then(async () => {
        const sendElement = screen.getByTitle('send');
        act(() => {
          fireEvent.click(sendElement);
        });
        // wait for dialog to be rendered

        await waitFor(() => expect(screen.getByTitle('close-button')).toBeVisible(), {
          timeout: 11000,
        }).then(() => {
          const closeElement = screen.getByTitle('close-button');
          act(() => {
            fireEvent.click(closeElement);
          });
          // waitFor(() => expect(screen.getByTitle('sendmessage')).toBeVisible()).then(() => {
          expect(closeElement).toBeTruthy();
          // });
        });
      });
    });
  });
});

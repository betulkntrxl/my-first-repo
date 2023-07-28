import React from 'react';
import {
  render,
  cleanup,
  screen,
  waitFor,
  getByText,
  getByTitle,
  fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from './App';

const server = setupServer(
  rest.post('/api/prompt', (req, res, ctx) =>
    res(
      ctx.json({ errorMessage: 'User is not logged in, authenticate path is /api/auth/login' }),
      ctx.status(401)
    )
  ),
  rest.get('/api/version', (req, res, ctx) => res(ctx.json({ greeting: 'hello there' })))
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('testing the App', () => {
  afterEach(cleanup);

  it('sends a message and returns status 401 Unauthorized error', async () => {
    render(<App />);
    const user = userEvent.setup();
    const sendmessageElement = screen.getByTitle('sendmessage');
    await user.click(sendmessageElement);
    await user.keyboard('hello');
    const sendElement = screen.getByTitle('send');
    await user.click(sendElement);
    // wait for dialog to be rendered

    // await waitFor(() => expect(screen.getByTestId('cancel-button')).toBeVisible(), {
    await waitFor(() => expect(screen.getByTitle('cancel-button')).toBeVisible(), {
      timeout: 5000,
    }).then(() => {
      fireEvent.click(screen.getByTitle('cancel-button'));
      // const cancelElement = screen.getByTitle('cancel-button');
      // user.click(cancelElement);
      // expect(cancelElement).toBeTruthy();
    });
    //  await new Promise(res => setTimeout(res, 3000));
    //  const cancelElement = screen.getByTitle('cancel-button');
    // fireEvent.click(screen.getByTitle('cancel-button'))
    //  const cancelElement = await screen.findByText('Cancel');
    // await user.click(cancelElement);
    expect(sendElement).toBeTruthy();
  }, 5000);

  /*   it('sends a message and returns status 401 Unauthorized error', async () => {
      render(<App />);
      const user = userEvent.setup();
      const sendmessageElement = screen.getByTitle('sendmessage');
      await user.click(sendmessageElement);
      await user.keyboard('hello');
      const sendElement = screen.getByTitle('send');
      await user.click(sendElement);
      // continue
      //  const continueElement = screen.getByTitle('continue-button');
      //  await user.click(continueElement);
      expect(sendElement).toBeTruthy();
    }, 5000); */
});

import React from 'react';
import { render, cleanup, screen, waitFor, act, fireEvent } from '@testing-library/react';

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from './App';

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

const MOCK_RESOURCE_BUNDLE = {
  menu: {
    'assistant-setup': {
      'message-template': {
        'system-message-template': {
          template1: 'En',
        },
      },
    },
  },
};

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: () => 'En',
    i18n: {
      /* eslint-disable */
      changeLanguage: () => new Promise(() => {}),
      getResourceBundle: (bundle: String, namespace: String) => MOCK_RESOURCE_BUNDLE,
      /* eslint-enable */
    },
  }),
}));

describe('testing the App', () => {
  afterEach(cleanup);

  it('change language to english', async () => {
    await act(async () => {
      render(<App />);

      await waitFor(() => expect(screen.getByLabelText('language')).toBeVisible()).then(() => {
        const languageElement = screen.getByLabelText('language');

        fireEvent.click(languageElement);

        expect(languageElement).toBeTruthy();
      });
    });
  });
});

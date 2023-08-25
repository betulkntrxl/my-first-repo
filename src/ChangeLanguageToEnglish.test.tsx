import React from 'react';
import { render, cleanup, screen, waitFor, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from './App';
import * as mockEnglishResourceBundle from '../public/locales/en/translation.json';

const server = setupServer(
  rest.get('/api/version', (req, res, ctx) => res(ctx.json({ greeting: 'hello there' }))),
  rest.post('/api/app-insights-event', (req, res, ctx) => res(ctx.status(201))),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: any) => 'en',
    i18n: {
      /* eslint-disable */
      changeLanguage: () => new Promise(() => {}),
      getResourceBundle: (bundle: String, namespace: String) => mockEnglishResourceBundle,
      /* eslint-enable */
    },
  }),
}));

describe('testing the App', () => {
  afterEach(cleanup);

  it('change language to english', async () => {
    await act(async () => {
      render(<App />);
      const user = userEvent.setup();

      await waitFor(() => expect(screen.getByLabelText('language')).toBeVisible()).then(() => {
        const languageElement = screen.getByLabelText('language');

        fireEvent.click(languageElement);

        expect(languageElement).toBeTruthy();
      });
    });
  });
});

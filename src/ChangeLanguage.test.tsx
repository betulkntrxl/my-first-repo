import React from 'react';
import { render, cleanup, screen, waitFor, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from './App';

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
      getResourceBundle: (bundle: String, namespace: String) => ({
        menu: {
          title: 'Menu',
          'assistant-setup': {
            title: 'Assistant Setup',
            'message-template': {
              title: 'Message Template',
              'system-message-template': {
                title: 'System Message Template',
                template1: 'Assistant is a large language model trained by OpenAI.',
                template2: 'as an assistant',
                template3: 'as a agent understanding the sentiment',
                template4: 'as a mentor using the Socratic method',
              },
            },
            'system-message': {
              title: 'System Message',
              tooltip:
                'Give the model instructions about how it should behave and any context it should reference when generating a response. You can describe the assistant’s personality, tell it what it should and shouldn’t answer, and tell it how to format responses. There’s no token limit for this section, but it will be included with every API call, so it counts against the overall token limit.',
            },
          },
        },
      }),
      /* eslint-enable */
    },
  }),
}));

describe('testing the App', () => {
  afterEach(cleanup);

  it('change language', async () => {
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

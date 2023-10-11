// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextEncoder;

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: any) => str,
    i18n: {
      /* eslint-disable */
      changeLanguage: () => new Promise(() => {}),
      /* eslint-enable */
    },
  }),
}));

import oidcMiddleware from '@okta/oidc-middleware';

const { ExpressOIDC } = oidcMiddleware;

export const oidc = new ExpressOIDC({
  issuer: process.env.OKTA_ISSUER,
  client_id: process.env.OKTA_CLIENT_ID,
  client_secret: process.env.OKTA_CLIENT_SECRET,
  appBaseUrl: process.env.OKTA_BASE_URL,
  scope: 'openid profile email',
  routes: {
    login: {
      path: '/api/auth/login',
    },
    loginCallback: {
      path: '/api/auth/redirect',
    },
    logout: {
      path: '/',
    },
  },
});

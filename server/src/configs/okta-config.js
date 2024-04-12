import oidcMiddleware from '@okta/oidc-middleware';
import { logger } from './logger-config.js';

const setupOktaConfig = () => {
  const { ExpressOIDC } = oidcMiddleware;

  logger.info('Setting up Okta Config...');

  // We have custom claims / scopes for the McKesson ChatApp deployment to retrieve BU and extra groups
  const SCOPES = 'openid profile email ChatApp_groups';

  const oidc = new ExpressOIDC({
    issuer: process.env.OKTA_ISSUER,
    client_id: process.env.OKTA_CLIENT_ID,
    client_secret: process.env.OKTA_CLIENT_SECRET,
    appBaseUrl: process.env.OKTA_APP_BASE_URL,
    scope: SCOPES,
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

  logger.info(`Okta Config complete`);

  return oidc;
};

export { setupOktaConfig };

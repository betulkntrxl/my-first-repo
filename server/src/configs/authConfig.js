import { logger } from './logger.js';

const MSAL_CONFIG = {
  auth: {
    clientId: process.env.CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.TENANT_ID}`,
    clientSecret: process.env.CLIENT_SECRET,
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message, containsPii) {
        logger.info(`message ${message}`);
      },
      piiLoggingEnabled: false,
      logLevel: 'Info',
    },
  },
};

const REDIRECT_URI = process.env.REDIRECT_URI || 'https://localhost/api/auth/redirect';
const POST_LOGOUT_REDIRECT_URI = process.env.POST_LOGOUT_REDIRECT_URI || 'https://localhost/';
const GRAPH_ME_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';

export { MSAL_CONFIG, REDIRECT_URI, POST_LOGOUT_REDIRECT_URI, GRAPH_ME_ENDPOINT };

import express from 'express';
import morgan from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import { getSessionConfig } from './session-config.js';
import { logger } from './logger-config.js';

const setupMiddleware = expressWebServer => {
  logger.info('Setting up middleware...');

  expressWebServer.use(compression());
  expressWebServer.use(
    helmet.contentSecurityPolicy({
      directives: {
        frameAncestors: ['*.teams.microsoft.com'],
        'script-src': ["'self'", '*.teams.microsoft.com'],
      },
    }),
  );
  expressWebServer.disable('x-powered-by');
  expressWebServer.use(morgan(':date[clf] ":method :url"'));
  expressWebServer.use(bodyParser.json({ limit: '500kb' }));

  // Setup auth session
  expressWebServer.use(getSessionConfig());

  expressWebServer.use(express.urlencoded({ extended: false }));

  logger.info('Middleware setup complete');
};

export { setupMiddleware };

import express from 'express';
import morgan from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import session from 'express-session';
import { logger } from './logger.js';

export const setupMiddleware = expressWebServer => {
  expressWebServer.use(compression());
  expressWebServer.use(helmet({ contentSecurityPolicy: false }));
  expressWebServer.disable('x-powered-by');
  expressWebServer.use(morgan(':date[clf] ":method :url"'));
  expressWebServer.use(bodyParser.json());

  if (process.env.DEPLOY_ENVIRONMENT === 'cloud') {
    logger.info(`Using cloud config, setting cookie secure true...`);

    expressWebServer.use(
      session({
        name: 'mt-openai-chat',
        secret: process.env.EXPRESS_SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: true, // For deployment make sure the cookie is only transported over https
        },
      })
    );
  } else {
    logger.info(`Local deployment... setting cookie secure false...`);

    expressWebServer.use(
      session({
        name: 'local-mt-openai-chat',
        secret: 'super-secret-dev-secret', // For local development this secret doesn't matter
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: false, // For local development allow cookie to be transported over http
        },
      })
    );
  }

  expressWebServer.use(express.urlencoded({ extended: false }));
};

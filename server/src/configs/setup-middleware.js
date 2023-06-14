import express from 'express';
import morgan from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import session from 'express-session';
import { setupRedisClient } from './redis-client-config.js';
import { logger } from './logger.js';

export const setupMiddleware = expressWebServer => {
  logger.info('Setting up middleware...');

  expressWebServer.use(compression());
  expressWebServer.use(helmet({ contentSecurityPolicy: false }));
  expressWebServer.disable('x-powered-by');
  expressWebServer.use(morgan(':date[clf] ":method :url"'));
  expressWebServer.use(bodyParser.json());

  // Note: HTTPOnly and Secure Flags are set in the Kubernetes Manifest files, annotations on the ingress

  if (process.env.DEPLOY_ENVIRONMENT === 'cloud') {
    expressWebServer.use(
      session({
        name: 'mt-openai-chat',
        secret: process.env.EXPRESS_SESSION_SECRET || 'local-dev-secret',
        resave: false,
        saveUninitialized: false,
        store: setupRedisClient(),
      })
    );
  } else {
    expressWebServer.use(
      session({
        name: 'mt-openai-chat',
        secret: process.env.EXPRESS_SESSION_SECRET || 'local-dev-secret',
        resave: false,
        saveUninitialized: false,
      })
    );
  }

  // If deployed to the Cloud then setup Redis as a distributed session store
  // if (process.env.DEPLOY_ENVIRONMENT === 'cloud') {
  //   session.store = setupRedisClient();
  // }

  expressWebServer.use(express.urlencoded({ extended: false }));

  logger.info('Middleware setup complete');
};

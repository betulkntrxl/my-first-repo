import express from 'express';
import morgan from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
import session from 'express-session';
import { setupRedisClient } from './redis-client-config.js';
import { logger } from './logger.js';

export const setupMiddleware = expressWebServer => {
  logger.info('Setting up middleware...');

  expressWebServer.use(compression());
  expressWebServer.use(helmet());
  expressWebServer.disable('x-powered-by');
  expressWebServer.use(morgan(':date[clf] ":method :url"'));
  expressWebServer.use(bodyParser.json());

  // Note: HTTPOnly and Secure Flags are set in the Kubernetes Manifest files, annotations on the ingress
  const sessionOptions = {
    name: 'mt-openai-chat',
    secret: process.env.EXPRESS_SESSION_SECRET || 'local-dev-secret',
    genid(req) {
      return uuidv4(); // use UUIDs for session IDs
    },
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      maxAge: Number(process.env.SESSION_EXPIRY_IN_MILLISECONDS) || 1800000, // 30 mins
    },
  };

  // If deployed to the Cloud then setup Redis as a distributed session store
  if (process.env.DEPLOY_ENVIRONMENT === 'cloud') {
    sessionOptions.store = setupRedisClient();
  }

  // Setup auth session
  expressWebServer.use(session(sessionOptions));

  expressWebServer.use(express.urlencoded({ extended: false }));

  logger.info('Middleware setup complete');
};

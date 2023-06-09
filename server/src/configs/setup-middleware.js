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

  expressWebServer.use(
    session({
      name: 'mt-openai-chat',
      secret: process.env.EXPRESS_SESSION_SECRET || 'local-dev-secret',
      resave: false,
      saveUninitialized: false,
    })
  );

  expressWebServer.use(express.urlencoded({ extended: false }));
};

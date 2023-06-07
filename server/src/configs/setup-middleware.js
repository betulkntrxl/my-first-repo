import express from 'express';
import morgan from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import session from 'express-session';

export const setupMiddleware = expressWebServer => {
  expressWebServer.use(compression());
  expressWebServer.use(helmet({ contentSecurityPolicy: false }));
  expressWebServer.disable('x-powered-by');
  expressWebServer.use(morgan(':date[clf] ":method :url"'));
  expressWebServer.use(bodyParser.json());

  expressWebServer.use(
    session({
      secret: process.env.EXPRESS_SESSION_SECRET || 'super-secret-dev-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: true,
      },
    })
  );

  expressWebServer.use(express.urlencoded({ extended: false }));
};

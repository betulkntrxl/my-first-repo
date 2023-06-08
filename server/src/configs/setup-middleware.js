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

  if (process.env.DEPLOY_ENVIRONMENT === 'cloud') {
    expressWebServer.use(
      session({
        secret: process.env.EXPRESS_SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: true, // For deployment make sure the cookie is only transported over https
        },
      })
    );
  } else {
    expressWebServer.use(
      session({
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

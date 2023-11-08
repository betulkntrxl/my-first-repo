import { logger } from '../configs/logger-config.js';

// Check to see if user is logged in, if not redirect them to login route
/* eslint-disable */
const ensureAuthenticatedRedirectIfNot = (req, res, next) => {
  logger.info(`Checking if user is authenticated...`);

  if (!isAuthenticated(req)) {
    logger.info(`Redirecting to login`);
    return res.redirect('/api/auth/login'); // redirect to login route
  }

  next();
};
/* eslint-enable */

// Check to see if user is logged in, if not return HTTP Status 401
/* eslint-disable */
const ensureAuthenticated401IfNot = (req, res, next) => {
  logger.info(`Checking if user is authenticated for API...`);

  if (!isAuthenticated(req)) {
    logger.warn(`Session may have expired, returning HTTP Status 401 for prompt api`);
    return res.status(401).send('User is not logged in, authenticate path is /api/auth/login');
  }

  next();
};
/* eslint-enable */

const isAuthenticated = req => {
  if (
    process.env.ALLOW_TEST_USER === 'true' &&
    req.header('TEST_USER_API_KEY') &&
    req.header('TEST_USER_API_KEY') === process.env.TEST_USER_API_KEY
  ) {
    logger.info('Test user is authenticated...');
    return true;
  }

  logger.info(req.isAuthenticated() ? 'User is authenticated' : 'User is not authenticated');

  return req.isAuthenticated();
};

export { ensureAuthenticatedRedirectIfNot, ensureAuthenticated401IfNot, isAuthenticated };

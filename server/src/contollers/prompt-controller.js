import { logger } from '../configs/logger-config.js';

const addPromptHeaders = (req, res, next) => {
  logger.info(`Adding required and optional headers to http request to Mulesoft...`);

  // Adding headers for Mulesoft API
  req.headers.client_id = process.env.MULESOFT_OPENAI_CLIENT_ID;
  req.headers.client_secret = process.env.MULESOFT_OPENAI_CLIENT_SECRET;
  if (process.env.ALLOW_TEST_USER === 'true' && req.header('TEST_USER_API_KEY')) {
    logger.info('using fake email for test user');
    req.headers.urn = 'test-user@mckesson.com';
    req.headers.bu = 'McKesson Corporate';
  } else {
    req.headers.urn =
      req.userContext.userinfo.email ||
      req.userContext.userinfo.preferred_username ||
      'Not Available';
    req.headers.bu = req.userContext.userinfo.company || 'Not Available';
  }

  next();
};

export { addPromptHeaders };

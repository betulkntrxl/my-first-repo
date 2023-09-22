import express from 'express';
import { logger } from '../configs/logger-config.js';

const getOktaRoutes = okta => {
  const oktaRoutes = express.Router();

  logger.info(`Setting up Okta Routes...`);

  // Setup Okta routes defined by the Okta middleware library
  oktaRoutes.use(okta.router);

  oktaRoutes.get('/api/auth/logout', okta.forceLogoutAndRevoke(), (req, res) => {
    // Nothing here will execute, okta.forceLogoutAndRevoke() middleware does all the work.
    // After the redirects the user will end up at the root / again, basically asking them to log back in
  });

  logger.info(`Okta Routes setup complete`);

  return oktaRoutes;
};

export { getOktaRoutes };

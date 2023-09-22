import express from 'express';
import { ensureAuthenticatedRedirectIfNot } from '../common/auth-helpers.js';
import { logger } from '../configs/logger-config.js';

const getStaticConentRoutes = () => {
  const staticContentRoutes = express.Router();

  logger.info(`Setting up Static Content Routes...`);

  // Make sure the user is authenticated before serving static content
  staticContentRoutes.get('/', ensureAuthenticatedRedirectIfNot);

  // Serving the static content i.e. the React App
  staticContentRoutes.use(express.static('./build'));

  logger.info(`Static Content Routes setup complete`);

  return staticContentRoutes;
};

export { getStaticConentRoutes };

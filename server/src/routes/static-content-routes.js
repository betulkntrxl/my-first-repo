import express from 'express';
import { ensureAuthenticatedRedirectIfNot } from '../common/auth-helpers.js';
import { logger } from '../configs/logger-config.js';

const getStaticConentRoutes = () => {
  const staticContentRoutes = express.Router();

  // Make sure the user is authenticated before serving static content
  staticContentRoutes.get('/', ensureAuthenticatedRedirectIfNot);

  logger.info(`Serving static content...`);

  // Serving the static content i.e. the React App
  staticContentRoutes.use(express.static('./build'));

  logger.info(`App is now serviing static content`);

  return staticContentRoutes;
};

export { getStaticConentRoutes };

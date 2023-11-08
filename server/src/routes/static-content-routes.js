import express from 'express';
import { logger } from '../configs/logger-config.js';

const getStaticConentRoutes = () => {
  const staticContentRoutes = express.Router();

  logger.info(`Setting up Static Content Routes...`);

  staticContentRoutes.get('/');

  // Serving the static content i.e. the React App
  staticContentRoutes.use(express.static('./build'));

  logger.info(`Static Content Routes setup complete`);

  return staticContentRoutes;
};

export { getStaticConentRoutes };

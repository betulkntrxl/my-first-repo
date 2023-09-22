import express from 'express';
import { getVersion } from '../contollers/version-controller.js';
import { logger } from '../configs/logger-config.js';

const getVersionRoutes = () => {
  const versionRoutes = express.Router();

  logger.info(`Setting up app version route...`);

  versionRoutes.get('/api/version', getVersion);

  logger.info(`App version route setup complete`);

  return versionRoutes;
};
export { getVersionRoutes };

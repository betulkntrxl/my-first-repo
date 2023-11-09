import express from 'express';
import { getVersion, getOrgDeployment } from '../contollers/version-and-org-controller.js';
import { logger } from '../configs/logger-config.js';

const getVersionAndOrgRoutes = () => {
  const versionAndOrgRoutes = express.Router();

  logger.info(`Setting up App Version and Org routes...`);

  versionAndOrgRoutes.get('/api/version', getVersion);

  versionAndOrgRoutes.get('/api/org-deployment', getOrgDeployment);

  logger.info(`App Version and Org routes setup complete`);

  return versionAndOrgRoutes;
};
export { getVersionAndOrgRoutes };

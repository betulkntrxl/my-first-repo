import express from 'express';
import { ensureAuthenticated401IfNot } from '../common/auth-helpers.js';
import { addPromptHeaders } from '../contollers/prompt-controller.js';
import { logger } from '../configs/logger-config.js';

const getPromptRoutes = mulesoftProxy => {
  const promptRoutes = express.Router();

  logger.info(`Setting up Prompt route...`);

  // Ensure prompt route is Authenticated
  // Intercept the prompt request to add headers
  promptRoutes.use('/api/prompt', ensureAuthenticated401IfNot, addPromptHeaders);

  // Proxy prompt requests to the Mulesoft OpenAI Chat API
  // Note the user needs to be authenticated before calling this.
  // The auth check is done above
  promptRoutes.post('/api/prompt', mulesoftProxy);

  logger.info(`Prompt Routes setup complete`);

  return promptRoutes;
};

export { getPromptRoutes };

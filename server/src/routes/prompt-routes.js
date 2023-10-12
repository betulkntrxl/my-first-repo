import express from 'express';
import { ensureAuthenticated401IfNot } from '../common/auth-helpers.js';
import {
  checkIfUserIsAuthorizedForGPT4,
  addPromptHeaders,
} from '../contollers/prompt-controller.js';
import { logger } from '../configs/logger-config.js';

const getPromptRoutes = (mulesoft35TurboProxy, mulesoftGPT4Proxy) => {
  const promptRoutes = express.Router();

  logger.info(`Setting up Prompt route...`);

  // Ensure prompt route is Authenticated
  // Intercept the prompt request to add headers
  promptRoutes.use('/api/prompt', ensureAuthenticated401IfNot, addPromptHeaders);

  // Proxy 3.5 Turobo prompt requests to the Mulesoft OpenAI Chat API
  // Note the user needs to be authenticated before calling this.
  // The auth check is done above
  // All users can use 3.5 Turbo
  promptRoutes.post('/api/prompt/35turbo', mulesoft35TurboProxy);

  // Proxy GPT4 prompt requests to the Mulesoft OpenAI Chat API
  // Note the user needs to be authenticated before calling this.
  // The auth check is done above
  // Users need to be authorized to use GPT4
  promptRoutes.post('/api/prompt/gpt4', checkIfUserIsAuthorizedForGPT4, mulesoftGPT4Proxy);

  logger.info(`Prompt Routes setup complete`);

  return promptRoutes;
};

export { getPromptRoutes };

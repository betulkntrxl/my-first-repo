import express from 'express';
import { getAppInsightsRoutes } from './app-insights-routes.js';
import { getPromptRoutes } from './prompt-routes.js';
import { getVersionAndOrgRoutes } from './version-and-org-routes.js';
import { getOktaRoutes } from './okta-routes.js';
import { getStaticConentRoutes } from './static-content-routes.js';
import { getRateLimitConfigForUnKnownRoutes } from '../configs/rate-limiting-config.js';

const setupRoutes = (okta, mulesoft35TurboProxy, mulesoftGPT4Proxy, appInsights) => {
  const appRoutes = express.Router();

  appRoutes.use(getOktaRoutes(okta));

  appRoutes.use(getAppInsightsRoutes(appInsights));

  appRoutes.use(getPromptRoutes(mulesoft35TurboProxy, mulesoftGPT4Proxy));

  appRoutes.use(getVersionAndOrgRoutes());

  appRoutes.use(getStaticConentRoutes());

  const rateLimiter = getRateLimitConfigForUnKnownRoutes();
  appRoutes.use('*', rateLimiter);

  return appRoutes;
};

export { setupRoutes };

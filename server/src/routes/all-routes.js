import express from 'express';
import { getAppInsightsRoutes } from './app-insights-routes.js';
import { getPromptRoutes } from './prompt-routes.js';
import { getVersionRoutes } from './version-routes.js';
import { getOktaRoutes } from './okta-routes.js';
import { getStaticConentRoutes } from './static-content-routes.js';

const setupRoutes = (okta, mulesoftProxy, appInsights) => {
  const appRoutes = express.Router();

  appRoutes.use(getOktaRoutes(okta));

  appRoutes.use(getAppInsightsRoutes(appInsights));

  appRoutes.use(getPromptRoutes(mulesoftProxy));

  appRoutes.use(getVersionRoutes());

  appRoutes.use(getStaticConentRoutes());

  return appRoutes;
};

export { setupRoutes };

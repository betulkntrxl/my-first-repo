import express from 'express';
import { ensureAuthenticated401IfNot } from '../common/auth-helpers.js';
import { sendEvent, sendTrace } from '../contollers/app-insights-controller.js';

const getAppInsightsRoutes = appInsights => {
  const appInsightsRoutes = express.Router();

  // App Insights Events
  appInsightsRoutes.post(
    '/api/app-insights-event',
    ensureAuthenticated401IfNot,
    sendEvent(appInsights),
  );

  // App Insights Trace, Severity Levels available
  // Verbose = 0,
  // Information = 1,
  // Warning = 2,
  // Error = 3,
  // Critical = 4
  appInsightsRoutes.post(
    '/api/app-insights-trace',
    ensureAuthenticated401IfNot,
    sendTrace(appInsights),
  );

  return appInsightsRoutes;
};
export { getAppInsightsRoutes };

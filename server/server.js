/* eslint-disable */
// Initialzing App Insights before any other dependency is added
import appInsights from 'applicationinsights';

if (process.env.APPLICATION_INSIGHTS_CONNECTION_STRING) {
  logger.info('Starting Application Insights monitoring...');

  appInsights
    .setup(process.env.APPLICATION_INSIGHTS_CONNECTION_STRING)
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true, true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setInternalLogging(true, true)
    .setAutoCollectConsole(true, true)
    .setUseDiskRetryCaching(true)
    .setSendLiveMetrics(true)
    .setDistributedTracingMode(appInsights.DistributedTracingModes.AI)
    .start();

  logger.info('Application Insights setup complete');
}

import express from 'express';
import { setupMiddleware } from './src/configs/setup-middleware.js';
import { setupAuth } from './src/configs/setup-auth.js';
import { setupRoutes } from './src/routes/routes.js';
import { logger } from './src/configs/logger.js';
/* eslint-enable */

// Initializing web server
const expressWebServer = express();

// Setting up middleware for security and logging
setupMiddleware(expressWebServer);

// Setup authz with Azure
setupAuth(expressWebServer);

// Setup routes for api calls and to server the static content i.e. the React App
setupRoutes(expressWebServer);

const port = process.env.PORT || 8080;

// Starting web server
const start = Date.now();
expressWebServer.listen(port, () => {
  if (process.env.APPLICATION_INSIGHTS_CONNECTION_STRING) {
    const duration = Date.now() - start;
    appInsights.defaultClient.trackMetric({ name: 'server startup time', value: duration });
  }
  logger.info(`MT OpenAI Chat App UI server running on port ${port}`);
});

import { logger } from '../configs/logger-config.js';

const sendEvent = appInsights => (req, res, next) => {
  logger.debug(`ChatApp App Insights Event ${JSON.stringify(req.body)}`);
  if (process.env.DEPLOY_ENVIRONMENT === 'cloud') {
    appInsights.defaultClient.trackEvent(req.body);
    logger.debug(`ChatApp App Insights Event sent to App Insights`);
  }
  return res.status(201).end();
};

const sendTrace = appInsights => (req, res, next) => {
  logger.debug(`ChatApp App Insights Trace ${JSON.stringify(req.body)}`);
  if (process.env.DEPLOY_ENVIRONMENT === 'cloud') {
    appInsights.defaultClient.trackTrace(req.body);
    logger.debug(`ChatApp App Insights Trace sent to App Insights`);
  }
  return res.status(201).end();
};

export { sendEvent, sendTrace };

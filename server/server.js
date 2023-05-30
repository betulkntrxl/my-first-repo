import express from 'express';
import { setupMiddleware } from './src/configs/setup-middleware.js';
import { setupRoutes } from './src/routes/routes.js';
import { logger } from './src/configs/logger.js';

// Initializing web server
const expressWebServer = express();

// Setting up middleware for security and logging
setupMiddleware(expressWebServer);

// Setup routes for api calls and to server the static content i.e. the React App
setupRoutes(expressWebServer);

const port = process.env.PORT || 8080;

// Starting web server
expressWebServer.listen(port, () => {
  logger.info(`MT OpenAI Chat App UI server running on port ${port}`);
});

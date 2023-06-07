import express from 'express';
import https from 'https';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { setupMiddleware } from './src/configs/setup-middleware.js';
import { setupAuth } from './src/configs/setup-auth.js';
import { setupRoutes } from './src/routes/routes.js';
import { logger } from './src/configs/logger.js';

// Initializing web server
const expressWebServer = express();

// Setting up middleware for security and logging
setupMiddleware(expressWebServer);

// Setup authz with Azure
setupAuth(expressWebServer);

// Setup routes for api calls and to server the static content i.e. the React App
setupRoutes(expressWebServer);

const port = process.env.PORT || 443;

// Starting web server
if (process.env.DEPLOY_ENVIRONMENT === 'cloud') {
  expressWebServer.listen(port, () => {
    logger.info(`MT OpenAI Chat App UI server is running...`);
  });
} else {
  // Getting directory
  const dirname = path.dirname(fileURLToPath(import.meta.url));

  // Creating HTTPS server with local development TLS Certs
  const server = https.createServer(
    {
      key: fs.readFileSync(`${dirname}/certs/local-dev/key.pem`, 'utf8'),
      cert: fs.readFileSync(`${dirname}/certs/local-dev/cert.pem`, 'utf8'),
    },
    expressWebServer
  );

  server.listen(port, _ => {
    logger.info(`MT OpenAI Chat App UI server running on port ${port}`);
  });
}

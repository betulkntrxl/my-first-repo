import express from 'express';
import { logger } from '../configs/logger.js';

export const setupRoutes = expressWebServer => {
  // TODO add prompt route

  // Serving the static content i.e. the React App
  expressWebServer.use(express.static('./build'));
};

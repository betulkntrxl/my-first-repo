import redis from 'redis';
import RedisStore from 'connect-redis';
import { logger } from './logger.js';

export const setupRedisClient = () => {
  logger.info('Setting up Redis for a distributed session store...');

  // Redis client configuration
  const client = redis.createClient({
    // rediss for TLS
    url: `rediss://${process.env.REDIS_HOST}:6380`,
    password: process.env.REDIS_KEY,
  });

  // Connect to Redis
  client.connect().catch(exception => logger.error(`Failed to connect to redis ${exception}`));

  logger.info('Redis client configured and connected');

  // Create and return Redis Session Store
  return new RedisStore({ client });
};

import redis from 'redis';
import RedisStore from 'connect-redis';
import { logger } from './logger-config.js';

const setupRedisClient = () => {
  logger.info('Setting up Redis for a distributed session store...');

  // Redis client configuration
  const client = redis.createClient({
    // rediss for TLS
    url: `rediss://${process.env.REDIS_HOST}:6380`,
    password: process.env.REDIS_KEY,
  });

  // Connect to Redis
  client.connect().catch(exception => logger.error(`Failed to connect to Redis ${exception}`));

  client.on('error', error => {
    // This a known issue where the Redis socket closes unexpectedly
    // Catching it resets the connection so the connection stays alive
    logger.warn(`Redis connection ${error}`);
  });

  logger.info('Redis client configured and connected');

  // Create and return Redis Session Store
  return new RedisStore({ client });
};

export { setupRedisClient };

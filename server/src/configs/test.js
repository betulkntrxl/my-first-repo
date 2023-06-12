import redis from 'redis';

export const testRedis = async () => {
  // Connection configuration
  const cacheConnection = redis.createClient({
    // rediss for TLS
    url: `rediss://${process.env.REDIS_HOST}:6380`,
    password: process.env.REDIS_KEY,
  });

  // Connect to Redis
  await cacheConnection.connect();

  // PING command
  console.log('\nCache command: PING');
  console.log(`Cache response : ${await cacheConnection.ping()}`);

  // GET
  console.log('\nCache command: GET Message');
  console.log(`Cache response : ${await cacheConnection.get('Message')}`);

  // SET
  console.log('\nCache command: SET Message');
  console.log(
    `Cache response : ${await cacheConnection.set(
      'Message',
      'Hello! The cache is working from Node.js!'
    )}`
  );

  // GET again
  console.log('\nCache command: GET Message');
  console.log(`Cache response : ${await cacheConnection.get('Message')}`);

  // Client list, useful to see if connection list is growing...
  console.log('\nCache command: CLIENT LIST');
  console.log(`Cache response : ${await cacheConnection.sendCommand(['CLIENT', 'LIST'])}`);

  // Disconnect
  cacheConnection.disconnect();

  return 'Done';
};

import { createClient } from 'redis';

// Redis runs next to the app (127.0.0.1:6379), like MongoDB. A cache or session store is optional, so a Redis problem is logged
// and the server keeps running instead of exiting.
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  socket: {
    // a few quick retries, then give up: without Redis the app runs on and the log is not flooded with reconnect errors
    reconnectStrategy: retries => (retries >= 3 ? new Error('Redis is not reachable') : retries * 200)
  }
});

let redisErrorLogged = false;
redisClient.on('error', error => {
  if (redisErrorLogged) return;
  redisErrorLogged = true;
  console.error(`Redis Error: ${error.message}`);
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log(`Redis Connected: ${redisClient.options?.url || 'redis://127.0.0.1:6379'}`);
  } catch (error) {
    console.error(`Redis not available: ${error.message}`);
  }
};

export { redisClient };
export default connectRedis;

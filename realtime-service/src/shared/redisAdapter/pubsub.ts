import Redis from 'ioredis';

const publisher = new  Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
  password: process.env.REDIS_PASSWORD,  // If Redis is secured
  db: 0                        // Optional: Select specific DB (default is 0)
});

const subscriber = new  Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
  password: process.env.REDIS_PASSWORD,  // If Redis is secured
  db: 0                        // Optional: Select specific DB (default is 0)
});

// Track subscribed channels and their handlers
const subscriptions: Map<string, (message: any) => Promise<void>> = new Map();

// Subscribe to a channel
export const subscribeToChannel = (channel: string, handler: (message: any) => Promise<void>) => {
  // Check if already subscribed
  if (subscriptions.has(channel)) {
    console.log(`Already subscribed to channel: ${channel}`);
    return;
  }

  subscriber.subscribe(channel, (err, count) => {
    if (err) {
      console.error('Failed to subscribe:', err);
    } else {
      // Store the handler
      subscriptions.set(channel, handler);
      console.log(`Subscribed to ${channel}. Currently subscribed to ${count} channels.`);
    }
  });
};

// Update message handler to use stored handlers
subscriber.on('message', (channel, message) => {
  const handler = subscriptions.get(channel);
  if (handler) {
    handler(message);
    console.log(`✅ Received message from ${channel}: ${message}`);
  }
});

export const unsubscribeFromChannel = (channel: string) => {
  if (!subscriptions.has(channel)) {
    console.log(`Not subscribed to channel: ${channel}`);
    return;
  }

  subscriber.unsubscribe(channel, (err, count) => {
    if (err) {
      console.error('Failed to unsubscribe:', err);
    } else {
      // Remove the handler
      subscriptions.delete(channel);
      console.log(`Unsubscribed from ${channel}. Currently subscribed to ${count} channels.`);
    }
  });
};

// Helper to check if channel is subscribed
export const isSubscribed = (channel: string): boolean => {
  return subscriptions.has(channel);
};

// Publish a message to a channel
export const publishMessage = async (channel: string, message: string) => {
  console.log(`✅ Publishing message to ${channel}: ${message}`);
  await publisher.publish(channel, message);
};

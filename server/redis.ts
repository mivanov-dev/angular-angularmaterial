import * as redis from 'redis';
import { promisify } from 'util';
import { log } from './logger';
import { config } from './config';

const client = redis.createClient(config.redis);

client.on('message', (channel, message) => {
    log.info('redis:message:', channel, message);
});
client.on('subscribe', (channel, message) => {
    log.info('redis:subscribe:', channel, message);
});
client.on('unsubscribe', (channel, message) => {
    log.info('redis:unsubscribe:', channel, message);
});
// !!!
client.on('error', (error) => {
    log.error('redis:error:', JSON.stringify(error));
});
client.on('ready', () => {
    log.info('redis:ready:');
});
client.on('connect', () => {
    log.info('redis:connect:');
});
client.on('reconnecting', () => {
    log.warn('redis:reconnecting:');
});
client.on('end', () => {
    log.warn('redis:end:');
});

export const redisClient = {
    set: promisify(client.set).bind(client),
    get: promisify(client.get).bind(client),
};

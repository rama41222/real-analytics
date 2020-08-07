const Queue = require('bull');
const { redis, app } = require('./../config');

/**
 * Redis Options for the bull queue
 * @type {{password: string, port: (string|number), host: string, connectTimeout: number, maxRetriesPerRequest: null, enableReadyCheck: boolean}}
 */
const opts = {
  host: redis.ENDPOINT,
  port: redis.PORT,
  password: redis.PASSWORD,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  connectTimeout: 30000,
};


/**
 * New Queue for data processing
 * @type {Queue}
 */
const processDataQueue = new Queue('processData', {
  redis: opts
});

processDataQueue.on("error", err => console.log(err));
module.exports = processDataQueue;

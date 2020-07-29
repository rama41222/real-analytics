const Queue = require('bull');
const { redis } = require('./../config');
const processDataQueue = new Queue('processData', {
  redis: {
    host: redis.ENDPOINT,
    port: redis.PORT,
    password: redis.PASSWORD
  }
});

module.exports = processDataQueue;

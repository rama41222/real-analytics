const Queue = require('bull');
const { redis, app } = require('./../config');
const opts = {
  host: redis.ENDPOINT,
  port: redis.PORT,
  password: redis.PASSWORD,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  connectTimeout: 30000,
};

// if(app.ENV === 'production') {
//   opts.tls = { servername: redis.ENDPOINT };
// }

const processDataQueue = new Queue('processData', {
  redis: opts
});

processDataQueue.on("error", err => console.log(err));
module.exports = processDataQueue;

const Queue = require('bull');
const analyticsEmitter = require('../../lib/tasks');
const { redis, app } = require('./../../lib/config');
const processor = require('./../jobs/analytics.processor');

let active = false;

const opts = {
  host: redis.ENDPOINT,
  port: redis.PORT,
  password: redis.PASSWORD,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  connectTimeout: 30000,
};

const analyticsQueue = new Queue('analyticsQueue', {
  redis: opts
});

analyticsQueue.on("error", err => console.log(err));

analyticsQueue.on('global:completed', () => {
  analyticsQueue.getJobCounts().then(jobs => {
    console.log(`Global complete outside trigger:`, active,  jobs);
    if(!active && jobs.active === 0) {
      console.log(`Global complete inside trigger: `, active,  jobs.active);
      analyticsEmitter.emit('calculate');
    }
    if(jobs.active === 0) {
      active = true;
    }
  });
});

// Add function to process job queue
analyticsQueue.process(processor);

// module.exports = sendMailQueue;
module.exports = analyticsQueue;

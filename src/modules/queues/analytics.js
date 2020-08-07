const Queue = require('bull');
const analyticsEmitter = require('../../lib/tasks');
const { redis, app } = require('./../../lib/config');
const processor = require('./../jobs/analytics.processor');
/**
 * Check for the remaining jobs
 * @type {boolean}
 */
let active = false;

/**
 * Bull Queue options
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
 * Create a new Analytics Queue
 * @type {Queue}
 */
const analyticsQueue = new Queue('analyticsQueue', {
  redis: opts
});

/**
 * Queue Error listener
 */
analyticsQueue.on("error", err => console.log(err));

/**
 * Global queue complete listener
 */
analyticsQueue.on('global:completed', () => {
  /**
   * Gets the remaining jobs
   */
  analyticsQueue.getJobCounts().then(jobs => {
    console.log(`Global complete outside trigger:`, active,  jobs);
    // Debouncing the event to have only one calculate method invocation
    if(!active && jobs.active === 0) {
      console.log(`Global complete inside trigger: `, active,  jobs.active);
      // Invokes calculation task
      analyticsEmitter.emit('calculate');
    }
    // Debouncing params
    if(jobs.active === 0) {
      active = true;
    }
  });
});

// Add function to process job queue
analyticsQueue.process(processor);

// Exports the analytics queue
module.exports = analyticsQueue;

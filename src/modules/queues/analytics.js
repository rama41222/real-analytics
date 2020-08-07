const Queue = require('bull');
const  Redis = require('ioredis');
// const analyticsEmitter = require('../../lib/tasks');
const { redis, app } = require('./../../lib/config');
const { lambda } = require('./../../lib/database');
const processor = require('../jobs/analytics');

/**
 * Check for the remaining jobs
 * @type {boolean}
 */
let active = false;

let analyticsQueue;

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
try {
  const client = new Redis(opts);
  const connect = new Promise(( resolve, reject ) => {
    client.on('connect', () => {
      
      console.log(`Connected with ${client.options.host}:${client.options.port}`);
      
      try {
        /**
         * Create a new Analytics Queue
         * @type {Queue}
         */
         analyticsQueue = new Queue("analyticsQueue", {
          redis: client.options
        });
      } catch (error) {
        console.log("ERROR setting up queue", error);
      }
   
      // analyticsQueue = new Queue('analyticsQueue', client);
      
      /**
       * Queue Error listener
       */
      analyticsQueue.on("error", err => reject(new Error('analyticsQueue failed: ' + err.message)));
      
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
            const params = {
              
              // the lambda function we are going to invoke
              FunctionName: 'real-analytics-production-data-calculation',
              
              // type can be of Event type also
              InvocationType: 'RequestResponse',
              
              // Tail or none
              LogType: 'Tail',
              
              // data from other lambda function
              Payload: ''
            };
            
            lambda.invoke(params, function(err, data) {
              if (err) {
                throw new Error('Lamda failed err:', err)
              } else {
                console.log('Lambda successful', data)
              }
            })
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
      return resolve(analyticsQueue);
      
    });
  });
  
  module.exports = {
    connect
  };
  
  
}catch (e){
  console.log('RESID ERR',e)
}




// module.exports = analyticsQueue;

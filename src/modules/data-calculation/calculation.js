'use strict';
const { database } = require('./../../lib/database');
const { calculationsManager } = require('./../../lib/tasks');
const processor = require('../../modules/jobs/analytics');

let connection;

/**
 * Main Handler function for Lambda
 * @param event
 * @param context
 * @param cb
 * @returns {Promise<void>}
 */
module.exports.handler = async (event, context, cb) => {
  
  console.log(JSON.parse(event.Records[0].body));
  
  // Checking if the event loop is empty
  context.callbackWaitsForEmptyEventLoop = false;
  
  // Returning the promise will ensure that the first response always gets a proper response through the router
  const result = await new Promise(async (resolve, reject) => {
    
    // Reusing the mongodb connection whenever possible to keep away from cold starts
    if (!connection) {
      
      database.connect.then(async result => {
        
        connection = result;
        console.log('Connection Status', !!connection);
        
        // Process CSVs
        const timestamp = await processor(JSON.parse(event.Records[0].body));
        console.log(`timestamp: ${timestamp} sent for calculation`);
        return resolve(await calculationsManager(timestamp));
        
      }).catch(e => {
        
        console.log('error', e);
        connection = false;
        return reject(connection)
        
      })
    }
    
    // Process CSVs
    const timestamp = await processor(JSON.parse(event.Records[0].body));
    console.log(`timestamp: ${timestamp} sent for calculation for existing connection`);
    return resolve(await calculationsManager(timestamp));
  });
  
  cb(null, result);
  // }
};

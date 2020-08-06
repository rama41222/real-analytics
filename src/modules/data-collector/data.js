'use strict';
require('events').EventEmitter.prototype._maxListeners = 0;
const api = require('lambda-api')({ version: 'v1.0', base:'/v1/data-collector'});
const routes = require('./routes');
const { middleware } = require('./../../lib');
const { database } = require('./../../lib/database');
middleware(api);
routes(api);
let connection;

/**
 * Main Handler function for Lambda
 * @param event
 * @param context
 * @param cb
 * @returns {Promise<void>}
 */
module.exports.handler =  (event, context, cb) => {
  // Checking if the event loop is empty
  context.callbackWaitsForEmptyEventLoop = false;
  // Reusing the mongodb connection whenever possible to keep away from cold starts

  if(connection) {
    return api.run(event, context, cb);
  } else {
    // Returning the promise will ensure that the first response always gets a proper response through the router
    //   new Promise((resolve, reject) => {
      database.connect.then( result => {
        connection = result;
        console.log('Connection Status',!!connection);
        return api.run(event, context, cb);
        // resolve(connection);
      }).catch(e => {
        console.log('error',e);
        connection = false;
        // reject(new Error(`connection: ${connection}`));
        return cb(new Error(`connection: ${connection}`));
      })
    // });
    // Passing the events into lambda-api router
  }
};

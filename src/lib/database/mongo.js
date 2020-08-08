const mongoose = require('mongoose');
const { mongo } = require('./../config');

// Setting the promises for mongoose
mongoose.Promise = global.Promise;

/**
 * Promisified mongodb connection helps to wait until a connection is established before executing queries
 * Helpful in cold starts and testing
 * @type {Promise<unknown>}
 */
const connect = new Promise((resolve, reject) => {
  
  // connect to mongodb
  mongoose.connect(mongo.url, { useNewUrlParser: true, useUnifiedTopology: true });
  
  // Open connection
  mongoose.connection.once('open', () => {
    
    console.log(`mongodb running @ ${ mongo.url }`);
    resolve(true);
    
  }).on('error', e => {
    
    reject(new Error(`Mongo Error: ${ e.message }`));
    
  });
});

module.exports = {
  connect
};

const mongoose = require('mongoose');
const { mongo } = require('./../config');

mongoose.Promise = global.Promise;
/**
 * Promisified mongodb connection helps to wait until a connection is established before executing queries
 * Helpful in cold starts and testing
 * @type {Promise<unknown>}
 */
const connect = new Promise(( resolve, reject )=> {
    mongoose.connect(mongo.url,  { useNewUrlParser: true,  useUnifiedTopology: true  });
    mongoose.connection.once('open', () => {
      console.log(`mongodb running @ ${mongo.url}`);
      resolve(true);
    }).on('error', e => {
      reject(e.message);
    });
});

module.exports = {
  connect
};

const { status, store } = require('./view');
const { upload } = require('./../../lib/database');
/**
 * Data collector Routes
 * @param api
 * @param opts
 */
module.exports = (app, opts) => {
  
  // Checks the status of the function, [if authorization is implemented, should only be done by an admin]
  app.get('/status', status);
  
  // Processes the raw data from documents and stores it
  app.post('/store', store);
};

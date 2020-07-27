const { status,  store } = require('./view');

/**
 * User Routes
 * @param api
 * @param opts
 */
module.exports = (api, opts) => {
  // Checks the status of the function, [if authorization is implemented, should only be done by an admin]
  api.get('/status', status);
  // Processes the raw data from documents and stores it
  api.post('/store', store);
};

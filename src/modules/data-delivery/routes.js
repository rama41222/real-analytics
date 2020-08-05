const { status,  fetchAsset, fetchAssets } = require('./view');
const { upload } = require('./../../lib/database');
/**
 * User Routes
 * @param api
 * @param opts
 */
module.exports = (app, opts) => {
  // Checks the status of the function, [if authorization is implemented, should only be done by an admin]
  app.get('/status',status);
  // Fetch all assets
  app.get('/asset', fetchAssets);
  // Fetch asset by id
  app.get('/asset/:id', fetchAsset);
};

const bodyParser = require('body-parser');

/**
 * Common middleware for the application
 * @param api
 * @returns {Promise<void>}
 */
module.exports = async (app) => {
  
  // Body Parser
  app.use(bodyParser.json({ strict: false }));
  
  //  removed the built in cors
  //  api.use((req, res, next) => {
  //   res.cors();
  //   next();
  // });
};

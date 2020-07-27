/**
 * Common middleware for the application
 * @param api
 * @returns {Promise<void>}
 */
module.exports = async (api) => {
  api.use((req, res, next) => {
   res.cors();
   next();
 });
};

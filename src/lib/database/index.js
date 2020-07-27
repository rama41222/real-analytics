const database = require('./mongo');
const s3 = require('./s3');
/**
 * Common Database handler
 */
module.exports = {
  database,
  s3
};

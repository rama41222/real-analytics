const database = require('./mongo');
const s3 = require('./s3');
const upload  = require('./multer');
/**
 * Common Database handler
 */
module.exports = {
  database,
  s3,
  upload
};

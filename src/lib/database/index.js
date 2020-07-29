const database = require('./mongo');
const s3 = require('./s3');
const upload  = require('./multer');
const processDataQueue = require('./redis');
const { pusher, triggerPusherNotification } = require('./pusher');
/**
 * Common Database handler
 */
module.exports = {
  database,
  s3,
  upload,
  processDataQueue,
  pusher,
  triggerPusherNotification
};

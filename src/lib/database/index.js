const database = require('./mongo');
const lambda = require('./lambda');
const upload  = require('./multer');
const processDataQueue = require('./redis');
const { pusher, triggerPusherNotification } = require('./pusher');
/**
 * Common Database handler
 */
module.exports = {
  database,
  lambda,
  upload,
  processDataQueue,
  pusher,
  triggerPusherNotification
};

const database = require('./mongo');
const lambda = require('./lambda');
const queue = require('./sqs');
const upload = require('./multer');
const { pusher, triggerPusherNotification } = require('./pusher');

/**
 * Common Database handler
 */
module.exports = {
  database,
  lambda,
  upload,
  pusher,
  queue,
  triggerPusherNotification
};

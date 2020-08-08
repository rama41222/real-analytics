const { aws } = require('./../config');
const AWS = require('aws-sdk');

/**
 * AWS Config
 */
AWS.config.update({
  accessKeyId: aws.AWS_ACCESS_KEY,
  secretAccessKey: aws.AWS_SECRET,
});

/**
 * configure a lambda connector
 * @type {Lambda}
 */
const lambda = new AWS.Lambda({ region: aws.AWS_REGION });
module.exports = lambda;

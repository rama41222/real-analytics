const { aws } = require('./../config');
const AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: aws.AWS_ACCESS_KEY,
  secretAccessKey: aws.AWS_SECRET,
});
/**
 * configure a s3 bucket
 * @type {Lambda}
 */
const lambda = new AWS.Lambda( {  region: aws.AWS_REGION  });
module.exports = lambda;

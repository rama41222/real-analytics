const { aws } = require('./../config');
const AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: aws.AWS_ACCESS_KEY,
  secretAccessKey: aws.AWS_SECRET,
});
/**
 * configure a s3 bucket
 * @type {S3}
 */
const s3 = new AWS.S3();
module.exports = s3;

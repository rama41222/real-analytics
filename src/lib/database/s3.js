const { aws } = require('./../config');
const AWS = require('aws-sdk');

/**
 * configure a s3 bucket
 * @type {S3}
 */
const s3 = new AWS.S3({
  accessKeyId: aws.AWS_ACCESS_KEY,
  secretAccessKey: aws.AWS_SECRET,
  region: aws.AWS_REGION,
});

module.exports = s3;

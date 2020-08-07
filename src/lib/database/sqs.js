const { aws } = require('./../config');
const AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: aws.AWS_ACCESS_KEY,
  secretAccessKey: aws.AWS_SECRET
});

const queueUrl = `https://sqs.ap-south-1.amazonaws.com/151323105413/analyticsSQS`;

/**
 * configure a sqs connector
 * @type {Lambda}
 */
const sqs = new AWS.SQS( {  region: aws.AWS_REGION  });

module.exports = {
  sqs,
  queueUrl
};

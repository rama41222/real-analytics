const { response, messages, parseObject } = require('./../../lib');
const {offLoader ,process, listAssetByRefAndDate, sendToS3 } = require('./operations');
const multipart = require('aws-lambda-multipart-parser');


/**
 * Lambda function status checking
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const status = async(req, res) => {
  res.status(200).json(response(messages.success.general, {}, 200));
};

/**
 * Store the files
 * @param req
 * @param res
 * @returns {Promise<void|any>}
 */
const store = async(req, res) => {
  const jobId = req.id;
  let parsedFile;
  try {
    parsedFile = multipart.parse(req, false);
  } catch (e) {
    return res.status(400).json(response(messages.error.data.parse_error, null, 400));
  }
  if(!parsedFile || Object.keys(parsedFile).length <= 0) {
    return res.status(400).json(response(messages.error.data.not_found, null, 400));
  }
  await offLoader(jobId, parsedFile);
  res.status(200).json(response(messages.success.offloaded, { jobId }, 200));
};

module.exports = {
  status,
  store,
};

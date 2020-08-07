const { response, messages, parseObject} = require('./../../lib');
const {offLoader ,process, listAssetByRefAndDate } = require('./operations');
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
  // Get the job id
  const jobId = req.id;
  let parsedFile;
  try {
    // parse the csv
    parsedFile = multipart.parse(req, false);
  } catch (e) {
    // return if parsing error
    return res.status(400).json(response(messages.error.data.parse_error, null, 400));
  }
  // file names
  const fileKeys = Object.keys(parsedFile);
  // if no files or error return
  if(!parsedFile || fileKeys.length <= 0) {
    return res.status(400).json(response(messages.error.data.not_found, null, 400));
  }
  // offload the task to the bull queue
  const status = await offLoader(jobId, parsedFile);
  // success response
  res.status(200).json(response(messages.success.offloaded, { jobId, status }, 200));
};

module.exports = {
  status,
  store,
};

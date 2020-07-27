const { response, messages } = require('./../../lib');
const { listAssetByRef, process, listUnitByRef } = require('./operations');
const { s3 } = require('./../../lib/database');
/**
 * Lambda function status checking
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const status = async(req, res) => {
  s3.set
  res.status(200).json(response(messages.success.general, {}, 200));
};

/**
 * Store the files
 * @param req
 * @param res
 * @returns {Promise<void|any>}
 */
const store = async( req, res) => {
  // store the file to s3 bucket
  // asynchronously offload the task to event loop
  // return 200
  res.status(200).json(response(messages.success.general, null, 200));
};

module.exports = {
  status,
  store,
};

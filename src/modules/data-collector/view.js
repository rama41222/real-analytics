const { response, messages } = require('./../../lib');
const { listAssetByRef, process, listUnitByRef } = require('./operations');

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
const store = async( req, res) => {
  res.status(200).json(response(messages.success.general, null, 200));
};

module.exports = {
  status,
  store,
};

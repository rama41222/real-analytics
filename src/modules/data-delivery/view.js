const { response, messages } = require('./../../lib');
const { listOne, list } = require('./operations');

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
 * Fetch the analytics object based on various filters
 * @param req
 * @param res
 * @returns {Promise<void|any>}
 */
const fetchAssets = async(req, res) => {
  let opts = {};
  let sort = {};
  // skip assets
  const skip = parseInt(req.query.skip) || 0;
  // limit assets
  const limit = parseInt(req.query.limit) || 100;
  // extract query params
  let { order, field, assetId, timestamp } = req.query;
  // validate the order, field assetid and timestamp
  if(assetId && typeof assetId === 'string') opts.asset = assetId;
  if(timestamp && typeof timestamp === 'string') opts.timestamp = timestamp;
  if(field && typeof field === 'string') sort[`${field}`] = order;
  // List the data
  res.status(200).json(response(messages.success.general, await list(limit, skip,  sort, opts)));
};

/**
 * Fetch analytics object by id
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const fetchAsset = async(req, res) => {
  // gets the analytics id
  const id = req.params.id;
  res.status(200).json(response(messages.success.general, await listOne(id)));
};

module.exports = {
  status,
  fetchAsset,
  fetchAssets
};

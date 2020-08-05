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
 * Store the files
 * @param req
 * @param res
 * @returns {Promise<void|any>}
 */
const fetchAssets = async(req, res) => {
  let opts = {};
  let sort = {};
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 100;
  let { order, field, assetId } = req.query;
  if(assetId && typeof assetId === 'string') opts.topicId = assetId;
  if(field && typeof field === 'string') sort[`${field}`] = order;
  res.status(200).json(response(messages.success.general, await list(limit, skip,  sort, opts)));
};


const fetchAsset = async(req, res) => {
  const id = req.params.id;
  res.status(200).json(response(messages.success.general, await listOne(id)));
};

module.exports = {
  status,
  fetchAsset,
  fetchAssets
};

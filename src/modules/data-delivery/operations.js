const Asset = require('../data-collector/models/asset');
const Analytics = require('../../lib/common/models');

/**
 *
 * @param id
 * @returns {Promise<*>}
 */
const listOne = async (id) => {
  return await Analytics.findOne({ asset: id }).select({ __v: 0, createdAt: 0, updatedAt: 0 }).lean();
};

/**
 * This operation will list down all the precalculated data for a time. timestamp can be used to filter
 * @param limit
 * @param skip
 * @param sort
 * @param opts
 * @returns {Promise<{analytics, total: *}>}
 */
const list = async (limit = 10, skip = 0, sort, opts) => {
  
  // query to list the pre calculated data
  const analytics = await Analytics.find()
    .where(opts)
    .select({ __v: 0, asset: 0, createdAt: 0, updatedAt: 0 })
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();
  
  // Total count for pagination
  const total = await Analytics.find()
    .where(opts)
    .select({ _id: 1 })
    .count();
  
  return { total, analytics };
};

module.exports = {
  list,
  listOne
};

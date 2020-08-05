const Asset = require('./../data-collector/asset.model');
const Analytics = require('./../../lib/common.models');


const listOne = async(id) => {
  return await Analytics.findOne({ asset: id }).select({__v: 0, createdAt: 0, updatedAt: 0}).lean();
};

const list = async(limit = 10, skip = 0, sort, opts) => {
  const analytics =  await Analytics.find()
    .where(opts)
    .select({ __v: 0, asset:0, createdAt: 0, updatedAt: 0 })
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();
  
  const total = await Analytics.find()
    .where(opts)
    .select({_id: 1})
    .count();

  return { total, analytics };
};

module.exports = {
  list,
  listOne
};

const { messages } = require('./../../lib');
const Analytics = require('./../../lib/common.models');


const listOne = async(id) => {
  return await Analytics.findOneById(id).populate('asset').lean();
};

const list = async(limit = 10, skip = 0) => {
  const total = await Analytics.count();
  const assets = await Analytics.find()
    .populate('asset', { email: 1, _id: 1 })
    .select({ __v: 0 })
    .sort({createdAt: -1})
    .skip(skip)
    .limit(limit)
    .lean();
  return { total, assets };
};

module.exports = {
  list,
  listOne
};

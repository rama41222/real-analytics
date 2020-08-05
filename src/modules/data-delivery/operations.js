const { messages } = require('./../../lib');
const Analytics = require('./../../lib/common.models');


const listOne = async(id) => {
  return await Analytics.findOneById(id).populate('asset').lean();
};

const list = async(limit = 10, skip = 0, sort, opts) => {
  const analytics =  await Analytics.find()
    .where(opts)
    .populate('topicId', { name: 1, _id: 1 })
    .populate('user', { name: 1, _id: 1 })
    .select({ __v: 0 })
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

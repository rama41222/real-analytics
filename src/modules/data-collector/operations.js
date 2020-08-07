const Asset = require('./asset.model');
const Unit = require('./unit.model');
const analyticsQueue  = require('./../queues');

/**
 * Offloader is use to send tasks to the queue modules
 * @param jobId
 * @param parsedFile
 * @returns {Promise<void>}
 */
const offLoader = async (jobId, parsedFile) => {
  // Perform the action in eventloop
  return process.nextTick(()=> {
    // Queue options
    const jobOptions = {
      delay: 0,
      attempts: 2,
    };
    // for each file
    for(let filename in parsedFile) {
      // data object
      const data = { jobId, filename: parsedFile[filename].filename, parsedFile: parsedFile[filename] };
      console.log('calling the queue');
      // add the job to the queue
      analyticsQueue.add(data, jobOptions);
    }
  });
};

/**
 * Listing a single Asset by ref
 * @param ref
 * @returns {Promise<AggregationCursor|RegExpExecArray>}
 */
const listAssetByRefAndDate = async({ref, timestamp}) => {
  return await Asset.findOne({ ref, timestamp }, { __v: 0 }).exec();
};

/**
 *  Listing a single unit by ref
 * @param ref
 * @returns {Promise<boolean>}
 */
const listUnitByRef = async(ref) => {
  const count = await Unit.findOne({ ref }, { __v: 0 }).exec();
  return count > 0;
};

module.exports = {
  process,
  listUnitByRef,
  listAssetByRefAndDate,
  offLoader
};

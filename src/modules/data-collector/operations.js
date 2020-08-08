const Asset = require('./models/asset');
const Unit = require('./models/unit');
const { queue } = require('./../../lib/database');

/**
 * Offloader is use to send tasks to the queue modules
 * @param jobId
 * @param parsedFile
 * @returns {Promise<void>}
 */
const offLoader = async (jobId, parsedFile) => {
  return await new Promise(async (resolve, reject) => {
    console.log('calling the queue:', jobId);
    
    // for each file
    for (let filename in parsedFile) {
      
      // data object
      const data = { jobId, filename: parsedFile[filename].filename, parsedFile: parsedFile[filename] };
      
      // Job options for SQS
      const jobOptions = {
        QueueUrl: queue.queueUrl,
        MessageBody: JSON.stringify(data)
      };
      
      // Add the job to the SQS
      queue.sqs.sendMessage(jobOptions, function (err, resp) {
        if (err) {
          return reject(new Error('error when adding to queue:' + err));
        }
        return resolve(resp);
      });
    }
  });
  
};

/**
 * Listing a single Asset by ref
 * @param ref
 * @returns {Promise<AggregationCursor|RegExpExecArray>}
 */
const listAssetByRefAndDate = async ({ ref, timestamp }) => {
  return Asset.findOne({ ref, timestamp }, { __v: 0 }).lean();
};

/**
 *  Listing a single unit by ref
 * @param ref
 * @returns {Promise<boolean>}
 */
const listUnitByRef = async (ref) => {
  const unit = await Unit.findOne({ ref }, { __v: 0 }).lean();
  return unit;
};

module.exports = {
  process,
  listUnitByRef,
  listAssetByRefAndDate,
  offLoader
};

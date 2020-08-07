const Asset = require('./models/asset');
const Unit = require('./models/unit');
// const { connect } = require('./../queues');
const { queue } = require('./../../lib/database');

/**
 * Offloader is use to send tasks to the queue modules
 * @param jobId
 * @param parsedFile
 * @returns {Promise<void>}
 */
const offLoader = async (jobId, parsedFile) => {
  return await new Promise( async(resolve, reject) => {
    // Queue options
    // const jobOptions = {
    //   delay: 0,
    //   attempts: 2,
    // };
  
    console.log('calling the queue');
    
    // for each file
    for (let filename in parsedFile) {
    
      // data object
      const data = { jobId, filename: parsedFile[filename].filename, parsedFile: parsedFile[filename] };
      
      const jobOptions = {
        QueueUrl: queue.queueUrl,
        MessageBody: JSON.stringify(data)
      };
      queue.sqs.sendMessage(jobOptions, function (err, resp) {
        if(err) {
          return reject(new Error('error when adding to queue:' + err));
        }
        return resolve(resp);
      });
      // add the job to the queue
      // await connect.then(queue => {
      //
      //   queue.add(data, jobOptions);
      //
      //   console.log('added the job', jobId)
      // }).catch(e => {
      //   return reject(new Error('error when adding to queue:' + e))
      // })
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

const Asset = require('./asset.model');
const Unit = require('./unit.model');
const { v4: uuidv4 } = require('uuid');
const Upload = require('./upload.model');
const { config } = require('./../../lib');
const { s3, pusher, processDataQueue } = require('./../../lib/database');
const csv =require("csvtojson");
const { parseObject, fileParser } = require('./../../lib');

/**
 * process documents and stores them accordingly
 * @param assetOptions
 * @param unitOptions
 * @param asset
 * @param unit
 * @returns {Promise<{unit: *, asset: *, status: *}|*[]>}
 */
const process = async(assetOptions, unitOptions, asset, unit) => {
  const options = {upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true, context: 'query'};
  const newAsset = await Asset.findOneAndUpdate(assetOptions, asset, options);
  if(!newAsset) {
    return { asset, unit, success: false };
  }
  unit.asset = newAsset._id;
  const newUnit = await Unit.findOneAndUpdate(unitOptions, unit, options);
  if(!newUnit){
    return { asset, unit, success: false };
  }
  return { asset, unit, success: true };
};


const offLoader = async (jobId, parsedFile) => {
  const options = {
    delay: 5000, // 1 min in ms
    attempts: 1
  };
  console.log('queued');
  for(let filename in parsedFile) {
    let myid = uuidv4();
    const data = {
      jobId,
      filename: parsedFile[filename].filename,
      parsedFile: parsedFile[filename],
    };

    processDataQueue.process(myid,async (job, done) => {
      try {
      const x = await dataVerifier(job.data, done);
        if(x) {
          pusher.trigger('real-analytics', 'file-upload', {
              data: {
                job: job.data.jobId, filename: job.data.filename, units: x.length, status: true, error: null
              }
            })
        }
      } catch(e) {
        pusher.trigger('real-analytics', 'file-upload', {
          data: {
            job: job.data.jobId, filename: job.data.filename, units: null, status: false, error: e.message
          }
        })
      }
    });
    await processDataQueue.add(myid,data, options);
  }
  return true;
};

const dataVerifier = async({ filename, jobId, parsedFile }, done) => {
  if(!parsedFile || !parsedFile.content) {
    return false;
  }
  
  const fileString =  await fileParser(parsedFile);
  const validatedFile = await csv ({ delimiter: 'auto',  trim: true, checkType: true, })
    .fromString (fileString)
    .subscribe (async (json) =>{
      const savedData = await new Promise(async (resolve,reject)=>{
        const { asset, unit, errors} = await parseObject(json);
        if(errors && errors.length > 0) {
          reject(errors);
        }
        const assetOptions = { timestamp: asset.timestamp, ref: asset.ref };
        const unitOptions = { timestamp: unit.timestamp, ref: unit.ref };
        const proc =  await process(assetOptions, unitOptions, asset, unit);
        
        if(!proc.success) {
          reject(new Error(`Database error in: ${JSON.stringify(proc)}`));
        }
        resolve(proc);
        return proc
      }).catch(e=> {
        pusher.trigger('real-analytics', 'file-upload', {
          data: {
            job: jobId, filename: filename, units: null, status: false, error: e.message
          }
        })
      });
      return savedData;
    }, async(error) => {
      pusher.trigger('real-analytics', 'file-upload', {
        data: {
          job: jobId, filename: filename, units: null, status: false, error: error
        }
      });
      done()
    });
  return validatedFile ? validatedFile : false;
};
/**
 * Listing a single Asset by ref
 * @param ref
 * @returns {Promise<AggregationCursor|RegExpExecArray>}
 */
const listAssetByRefAndDate = async({ref, timestamp}) => {
  return Asset.findOne({ ref, timestamp }, { __v: 0 }).exec();
};

/**
 *  Listing a single unit by ref
 * @param ref
 * @returns {Promise<boolean>}
 */
const listUnitByRef = async(ref) => {
  const count = Unit.findOne({ ref }, { __v: 0 }).exec();
  return count > 0;
};


module.exports = {
  process,
  listUnitByRef,
  listAssetByRefAndDate,
  offLoader
};

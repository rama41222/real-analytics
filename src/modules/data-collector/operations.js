const Asset = require('./asset.model');
const Unit = require('./unit.model');
const { v4: uuidv4 } = require('uuid');
const { messages, validateObject } = require('./../../lib');
const analyticsEmitter = require('../../lib/tasks');
const { lambda ,processDataQueue, triggerPusherNotification } = require('./../../lib/database');
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

/**
 *
 * @param jobId
 * @param parsedFile
 * @returns {Promise<void>}
 */
const offLoader = async (jobId, parsedFile) => {
  const options = { delay: 0, attempts: 1 };
  let active = false;
  for(let filename in parsedFile) {
    let qId = uuidv4();
    const data = { jobId, filename: parsedFile[filename].filename, parsedFile: parsedFile[filename] };
    processDataQueue.process(qId,5,async (job, done) => {
      try {
        const completedData = await dataVerifier(job.data, done);
        if(completedData) {
          await triggerPusherNotification( {
            job: job.data.jobId,
            filename: job.data.filename,
            units: completedData.length,
            status: true,
            error: null
          })
        } else {
          await triggerPusherNotification( {
            job: job.data.jobId,
            filename: job.data.filename,
            units: null,
            status: false,
            error: messages.error.data.invalid
          })
        }
      } catch(e) {
        await triggerPusherNotification({
          job: job.data.jobId,
          filename: job.data.filename,
          units: null,
          status: false,
          error: e.message
        });
      } finally {
        done()
      }
    });
    await processDataQueue.add(qId, data, options);
    processDataQueue.on('global:completed', () => {
      processDataQueue.getJobCounts().then(jobs => {
        if(!active && jobs.active === 0) {
          analyticsEmitter.emit('calculate');
        }
        if(jobs.active === 0) {
          active = true;
        }
      });
    });
  }
};


/**
 *
 * @param filename
 * @param jobId
 * @param parsedFile
 * @param done
 * @returns {Promise<boolean|any>}
 */
const dataVerifier = async({ filename, jobId, parsedFile }, done) => {
  
  if(!parsedFile || !parsedFile.content) {
    return false;
  }
  
  const fileString =  await fileParser(parsedFile);
  
  const validatedFile = await csv ({ delimiter: 'auto',  trim: true, checkType: true, })
    .fromString (fileString)
    .subscribe (async (json) =>{
      const savedData = await new Promise(async (resolve,reject)=>{
        const hasValidKeys = await validateObject(Object.keys(json));
        if(!hasValidKeys) {
          return reject(new Error(`Invalid Keys: ${JSON.stringify(json)}`));
        }
        const { asset, unit, errors} = await parseObject(json);
        if(errors && errors.length > 0) {
          return reject(new Error(`${errors.toString()}`));
        }
        const assetOptions = { timestamp: asset.timestamp, ref: asset.ref };
        const unitOptions = { timestamp: unit.timestamp, ref: unit.ref };
        const proc =  await process(assetOptions, unitOptions, asset, unit);
        
        if(!proc.success) {
          return reject(new Error(`Database error in: ${JSON.stringify(proc)}`));
        }
        resolve(proc);
        return proc;
      }).catch( async e => {
        await triggerPusherNotification({
          job: jobId, filename: filename, units: null, status: false, error: e.message
        });
      });
      return savedData;
    }, async(error) => {
      await triggerPusherNotification({
        job: jobId, filename: filename, units: null, status: false, error: error
      });
      done();
    });
  return validatedFile ? validatedFile : false;
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

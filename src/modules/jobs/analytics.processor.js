const csv = require("csvtojson");
const { lambda ,processDataQueue, triggerPusherNotification } = require('./../../lib/database');
const { parseObject, fileParser } = require('./../../lib');
const { messages, validateObject } = require('./../../lib');
const Asset = require('./../data-collector/asset.model');
const Unit = require('./../data-collector/unit.model');

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

const processor = async (job, done) => {
  console.log('called');
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
    console.log(`Queue finished for ${job.data.jobId}`);
    done()
  }
};

module.exports = processor;

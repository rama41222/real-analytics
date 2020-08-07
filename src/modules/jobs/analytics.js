const csv = require("csvtojson");
const { lambda , triggerPusherNotification } = require('./../../lib/database');
const { parseObject, fileParser } = require('./../../lib');
const { messages, validateObject } = require('./../../lib');
const Asset = require('../data-collector/models/asset');
const Unit = require('../data-collector/models/unit');

/**
 * Process each job added to the queue, this function is a parameter to the create analytics queue
 * @param assetOptions
 * @param unitOptions
 * @param asset
 * @param unit
 * @returns {Promise<{unit: *, success: boolean, asset: *}>}
 */
const process = async(assetOptions, unitOptions, asset, unit) => {
  // Query params
  const options = { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true, context: 'query'};
  // Get a new asset and update
  const newAsset = await Asset.findOneAndUpdate(assetOptions, asset, options);
  // If the asset is not found, return false
  if(!newAsset) {
    return { asset, unit, success: false };
  }
  // If asset is found, take the asset id
  unit.asset = newAsset._id;
  // Find a new unit
  const newUnit = await Unit.findOneAndUpdate(unitOptions, unit, options);
  // if no unit is found, return
  if(!newUnit){
    return { asset, unit, success: false };
  }
  // Else return the asset and the units belonging to the asset
  return { asset, unit, success: true };
};

/**
 * Verifies the data
 * @param filename
 * @param jobId
 * @param parsedFile
 * @returns {Promise<boolean|any>}
 */
const dataVerifier = async({ filename, jobId, parsedFile }) => {
  // If no parse file
  if(!parsedFile || !parsedFile.content) {
    return false;
  }
  
  // Parse the file for invalid characters
  const fileString =  await fileParser(parsedFile);
  
  /**
   * CSV to JSon conversion [Easy for mongodb]
   * @type {any[]}
   * @return JSON
   */
  const validatedFile = await csv ({ delimiter: 'auto',  trim: true, checkType: true, })
    .fromString (fileString)
    .subscribe (async (json) =>{
      // Returns a json object
      // Create a promise
      const savedData = await new Promise(async (resolve,reject) => {
        // inspect the json object for valid keys
        const hasValidKeys = await validateObject(Object.keys(json));
        if(!hasValidKeys) {
          // reject if invalid keys
          return reject(new Error(`Invalid Keys: ${JSON.stringify(json)}`));
        }
        // if valid keys , parse the object to separate units and assets
        const { asset, unit, errors} = await parseObject(json);
        // if error reject
        if(errors && errors.length > 0) {
          return reject(new Error(`${errors.toString()}`));
        }
        // Asset options
        const assetOptions = { timestamp: asset.timestamp, ref: asset.ref };
        // Unit options
        const unitOptions = { timestamp: unit.timestamp, ref: unit.ref };
        // Process each unit and asset
        const proc =  await process(assetOptions, unitOptions, asset, unit);
        // Db error
        if(!proc.success) {
          return reject(new Error(`Database error in: ${JSON.stringify(proc)}`));
        }
        // resolves
        resolve(proc);
        return proc;
      }).catch( async e => {
        // trigger pusher notification if error occurs with the relevant data
        await triggerPusherNotification({
          job: jobId, filename: filename, units: null, status: false, error: e.message
        });
      });
      return savedData;
    }, async(error) => {
      // trigger pusher notification if error occurs with the relevant data
      await triggerPusherNotification({
        job: jobId, filename: filename, units: null, status: false, error: error
      });
    });
    
  // return the validated file
  return validatedFile ? validatedFile : false;
};

/**
 * Handles the data verifier outcomes
 * @param job
 * @returns {Promise<void>}
 */
const processor = async (job) => {
  console.log('called');
  try {
    // Check if the data verifier returns proper object
    const completedData = await dataVerifier(job);
    // Triggers the completed notifications to the frontend
    if(completedData) {
      await triggerPusherNotification( {
        job: job.jobId,
        filename: job.filename,
        units: completedData.length,
        status: true,
        error: null
      })
    } else {
      await triggerPusherNotification( {
        job: job.jobId,
        filename: job.filename,
        units: null,
        status: false,
        error: messages.error.invalid
      })
    }
  } catch(e) {
    await triggerPusherNotification({
      job: job.jobId,
      filename: job.filename,
      units: null,
      status: false,
      error: e.message
    });
  } finally {
    console.log(`Queue finished for ${job.jobId}`);
  }
};

module.exports = processor;

const Asset = require('./asset.model');
const Unit = require('./unit.model');
const Upload = require('./upload.model');
const { config } = require('./../../lib');
const { s3 } = require('./../../lib/database');

/**
 * process documents and stores them accordingly
 * @param id
 * @returns {Promise<void>}
 */
const process = async(id) => {
  
  return User.findById(id).select({ __v: 0 }).exec();
};

/**
 * Listing a single Asset by ref
 * @param ref
 * @returns {Promise<AggregationCursor|RegExpExecArray>}
 */
const listAssetByRef = async(ref) => {
  return Asset.findOne({ ref }, { __v: 0 }).exec();
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


/**
 * Sends a file to S3
 * @param filename
 * @param file
 * @returns {Promise<unknown>}
 */
const sendToS3 = async(filename, file) => {
  console.log('file',file)
  return new Promise((resolve, reject) => {
    // s3 params
    const params = {
      params: { Bucket: config.aws.AWS_BUCKET_NAME, Key: filename, Body: file },
      options: { queueSize: 10 }
    };
    
    s3.upload(
      { Bucket: config.aws.AWS_BUCKET_NAME, Key: filename, Body: file },
      { queueSize: 10 }).on('httpUploadProgress',
      (evt) => {
      console.log('evt', evt);
    }).send(async (err, data) => {
      if(err) {
        console.log('errrr', err);
        reject(err);
        return false;
      }
      
      const { ETag, Location, key } = data || {};
      
      try {
        const s3Data = await Upload.create({ eTag: ETag, location: Location, key});
        resolve({ data, s3Data });
        return true;
      } catch(e) {
        reject(e.message);
        return false;
      }
    });
  });
};
module.exports = {
  process,
  listUnitByRef,
  listAssetByRef,
  sendToS3
};

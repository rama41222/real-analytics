const csv =require("csvtojson");
const { response, messages } = require('./../../lib');
const { listAssetByRef, process, listUnitByRef, sendToS3 } = require('./operations');
const multipart = require('aws-lambda-multipart-parser');

/**
 * Lambda function status checking
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const status = async(req, res) => {
  res.status(200).json(response(messages.success.general, {}, 200));
};

/**
 * Store the files
 * @param req
 * @param res
 * @returns {Promise<void|any>}
 */
const store = async(req, res) => {
  let parsedFile;
  try {
    // spotText === true response file will be Buffer
    parsedFile = multipart.parse(req, true);
    console.log('parsedFile', parsedFile)
  } catch (e) {
    console.log('parsedFile error', e)
    return res.status(400).json(response(messages.error.data.parse_error, null, 400));
  }
  
  if(!parsedFile) {
    return res.status(400).json(response(messages.error.data.invalid, null, 400));
  }
  
  for(let f in parsedFile) {
    const fileData = await sendToS3(parsedFile[f].filename, parsedFile[f].content)
      .catch(error => res.status(400).json(response(messages.error.data.upload_failed, null, 400)));
  console.log(typeof parsedFile[f].content);
  
    const validatedFile = await csv( {delimiter: 'auto'})
      .fromString(parsedFile[f].content.toString('utf8'))
      .subscribe((json)=>{
        console.log(json);
        return json;
      });
    console.log('sihott',     validatedFile);
  }
  return res.status(200).json(response(messages.success.general, [], 200));
};

module.exports = {
  status,
  store,
};

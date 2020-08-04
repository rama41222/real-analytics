/**
 *
 * @param parsedFile
 * @returns {Promise<string>}
 */
const fileParser = async(parsedFile) => {
  let fileString =  parsedFile.content.toString();
  let newString = fileString.split('ï»¿');
  if(newString.length > 1) {
    fileString = newString[1]
  }
  return fileString
};
/**
 * Parses the raw data from csv files
 *
 * @param data
 * @returns {Promise<*>}
 */
const parseObject = async(data) => {
  let asset = {};
  let errors = [];
  let unit = {};
  
  Object.keys(data).forEach(key => {
    let schemaKey = key.split('_');
    if(schemaKey.length === 1) {
      asset[key] = data[key];
    } else if(schemaKey.length > 1) {
      let type = schemaKey.shift();
      if(type === 'unit') {
        unit[schemaKey.join('_')] = data[key];
      } else if(type === 'asset') {
        asset[schemaKey.join('_')] = data[key];
      } else {
        unit[schemaKey.join('_')] = data[key];
        asset[schemaKey.join('_')] = data[key];
      }
    } else {
      errors.push({ key: data[key] });
    }
  });
  return { asset, unit, errors };
};

module.exports = {
  parseObject,
  fileParser
};

/**
 * Omits the defined characters
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
  // For each data key
  Object.keys(data).forEach(key => {
    // splitting the key
    let schemaKey = key.split('_');
    
    // Keys with only 1 _ will stay as it is
    if(schemaKey.length === 1) {
      asset[key] = data[key];
    } else if(schemaKey.length > 1) {
      // extract the type of key [unit, asset]
      let type = schemaKey.shift();
      if(type === 'unit') {
        // use the rest of the key as unit key
        unit[schemaKey.join('_')] = data[key];
      } else if(type === 'asset') {
        // use the rest of the key as asset key
        asset[schemaKey.join('_')] = data[key];
      } else {
        // otherwise
        unit[schemaKey.join('_')] = data[key];
        asset[schemaKey.join('_')] = data[key];
      }
    } else {
      // if the key doesn't fall into any of the abouve conditions
      errors.push({ key: data[key] });
    }
  });
  return { asset, unit, errors };
};

module.exports = {
  parseObject,
  fileParser
};

const middleware = require('./middleware');
const config = require('./config');
const { response, messages } = require('./utils');

/**
 * Exposing the required sections of the library
 * Can be done as whole components or as required
 * @type {{middleware: (function(*): Promise<void>)}}
 */
module.exports = {
  response,
  config,
  messages,
  middleware
};

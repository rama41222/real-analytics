/**
 * Common response formatter to keep the API responses consistent
 * @param message
 * @param data
 * @param status
 * @returns {{data: *, message: *, status: number}}
 */
const response = (message, data, status) => {
  if (!status) {
    status = data ? 200 : 400;
  }
  return { message, data, status }
};

module.exports = {
  response
};

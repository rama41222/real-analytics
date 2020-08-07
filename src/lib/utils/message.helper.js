/**
 *  All the custom messages can be but here
 * Group by module name
 * @type {{success: {offloaded: string, general: string, data: {created: string}, update: string}, error: {data: {parse_error: string, unauthorized: string, invalid: string, not_found: string, upload_failed: string, creation: string}}}}
 */
module.exports = {
  success: {
    update: 'Update successful',
    general: 'Operation successful',
    offloaded: 'Pending Results...',
    data: {
      created: 'Data processing successful',
    },
  },
  error: {
    data: {
      not_found: 'File not found',
      invalid: 'Invalid data format',
      creation: 'Data creation failed',
      unauthorized: 'Unauthorized Request',
      upload_failed: 'File upload failed',
      parse_error: 'File parsing failed'
    },
  }
};

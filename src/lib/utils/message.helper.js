/**
 * All the custom messages can be but here
 * Group by module name
 * @type {{success: {general: string, update: string, login: string, content: {created: string}, register: string}, error: {login: string, user: {unauthorized: string, invalid: string, update: string, registration: string, duplicate: string, not_found: string}, content: {unauthorized: string, invalid: string, duplicate: string, not_found: string, creation: string}}}}
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

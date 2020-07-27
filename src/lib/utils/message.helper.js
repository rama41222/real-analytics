/**
 * All the custom messages can be but here
 * Group by module name
 * @type {{success: {general: string, update: string, login: string, content: {created: string}, register: string}, error: {login: string, user: {unauthorized: string, invalid: string, update: string, registration: string, duplicate: string, not_found: string}, content: {unauthorized: string, invalid: string, duplicate: string, not_found: string, creation: string}}}}
 */
module.exports = {
  success: {
    update: 'Update successful',
    general: 'Operation successful',
    data: {
      created: 'Data processing successful',
    },
  },
  error: {
    data: {
      not_found: 'Data not found',
      invalid: 'Invalid data format',
      creation: 'Data creation failed',
      unauthorized: 'Unauthorized Request',
    },
  }
};

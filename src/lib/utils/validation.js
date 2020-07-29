/**
 * Parses the json data to validate schema before caging
 *
 * @param data
 * @returns {Promise<*>}
 */
const validateObject = async(data) => {
  const y = {
    portfolio: 'Houses',
      asset_ref: 'A_5',
    asset_address: 'Fritz-Löffler-Straße 16',
    asset_zipcode: '01069',
    asset_city: 'Dresden',
    asset_is_restricted: 'FALSE',
    asset_yoc: '1995',
    unit_ref: 'A_5_4',
    unit_size: '30',
    unit_is_rented: 'FALSE',
    unit_rent: '',
    unit_type: 'RESIDENTIAL',
    unit_tenant: '',
    unit_lease_start: '',
    unit_lease_end: '',
    data_timestamp: '01.01.19'
  }
  
};

module.exports = {
  validateObject
};

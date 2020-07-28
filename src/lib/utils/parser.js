/**
 * Parses the raw data from csv files
 *
 * @param data
 * @returns {Promise<*>}
 */
const parseUnitObject = async(data) => {
  const schema = {
    portfolio: 'Houses',
      asset_ref: 'A_5',
    asset_address: 'Fritz-Löffler-Straße 16',
    asset_zipcode: '01069',
    asset_city: 'Dresden',
    asset_is_restricted: 'FALSE',
    asset_yoc: '1995',
    unit_ref: 'A_5_3',
    unit_size: '55',
    unit_is_rented: 'TRUE',
    unit_rent: '450',
    unit_type: 'RESIDENTIAL',
    unit_tenant: 'Delmar Poissant',
    unit_lease_start: '01.09.18',
    unit_lease_end: '01.09.19',
    data_timestamp: '01.01.19'
  };
  return {};
};

/**
 * Parses the asset object
 * @param data
 * @returns {Promise<{}>}
 */
const parseAssetObject = async(data) => {
  return {};
};

module.exports = {
  parseUnitObject,
  parseAssetObject
};

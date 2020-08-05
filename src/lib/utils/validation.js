const _ = require('lodash');

/**
 * Parses the json data to validate schema beforehand
 *
 * @param data
 * @returns {Promise<*>}
 */
const validateObject = async (fileKeys) => {
  const keys = [
    "portfolio",
    "asset_ref",
    "asset_address",
    "asset_zipcode",
    "asset_city",
    "asset_is_restricted",
    "asset_yoc",
    "unit_ref",
    "unit_size",
    "unit_is_rented",
    "unit_rent",
    "unit_type",
    "unit_tenant",
    "unit_lease_start",
    "unit_lease_end",
    "data_timestamp",
  ];
  return _.isEqual(fileKeys, keys);
};

module.exports = {
  validateObject
};

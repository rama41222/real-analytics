/**
 * Building a key for the common tenants of the asset
 * @param tenant
 * @param type
 * @param leaseStart
 * @param leaseEnd
 * @returns {string}
 */
const keyBuilder = (tenant, type, leaseStart, leaseEnd) => {
  let key = '';
  
  // Tenant name
  if (tenant) {
    key += tenant.toLowerCase().replace(/\s/g, '_');
  }
  
  // Type of property
  if (type) {
    key += `_${ type.toLowerCase() }`
  }
  
  // Lease start date
  if (leaseStart) {
    key += `_${ leaseStart }`
  }
  
  // Lease end date
  if (leaseEnd) {
    key += `_${ leaseEnd }`
  }
  
  return key;
};

module.exports = keyBuilder;

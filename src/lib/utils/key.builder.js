const keyBuilder = (tenant, type, leaseStart, leaseEnd) => {
  let key = '';
  
  if (tenant) {
    key += tenant.toLowerCase().replace(/\s/g, '_');
  }
  if (type) {
    key += `_${ type.toLowerCase() }`
  }
  
  if (leaseStart) {
    key += `_${ leaseStart }`
  }
  
  if (leaseEnd) {
    key += `_${ leaseEnd }`
  }
  
  return key;
};

module.exports = keyBuilder;

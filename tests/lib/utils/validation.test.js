const expect = require('chai').expect;
const dotenv = require('dotenv');
const env = process.argv[process.argv.length - 1];
dotenv.config({ path: `./env/.env.${ env }` });
const { validateObject } = require('../../../src/lib');

describe('Lib module', () => {
  
  let testObject = {};
  
  before(() => {
    testObject = {
      portfolio: 'test_value',
      asset_ref: 'test_value',
      asset_address: 'test_value',
      asset_zipcode: 'test_value',
      asset_city: 'test_value',
      asset_is_restricted: 'test_value',
      asset_yoc: 'test_value',
      unit_ref: 'test_value',
      unit_size: 'test_value',
      unit_is_rented: 'test_value',
      unit_rent: 'test_value',
      unit_type: 'test_value',
      unit_tenant: 'test_value',
      unit_lease_start: 'test_value',
      unit_lease_end: 'test_value',
      data_timestamp: 'test_value',
    }
  });
  
  describe('Validation js', () => {
    it('Validate Object With keys', async () => {
      const result = await validateObject(Object.keys(testObject));
      expect(result).to.equal(true);
    });
    
    it('Validate Object wrong keys', async () => {
      const result = await validateObject(Object.keys({ "test_key": '' }));
      expect(result).to.equal(false);
    });
    
    it('Validate Object with extra keys', async () => {
      testObject.new_key = '3';
      const result = await validateObject(Object.keys(testObject));
      expect(result).to.equal(false);
      delete testObject.new_key;
      expect(testObject).to.not.have.property('new_key');
    });
  });
});


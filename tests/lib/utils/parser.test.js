const expect = require('chai').expect;
const dotenv = require('dotenv');
const env = process.argv[process.argv.length - 1];
dotenv.config({ path: `./env/.env.${ env }` });
const { parseObject } = require('../../../src/lib');

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
  
  describe('Parser js', () => {
    it('parse Object With keys', async () => {
      const result = await parseObject(testObject);
      console.log(result);
    });
  });
});


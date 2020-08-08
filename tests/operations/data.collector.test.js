const expect = require('chai').expect;
const dotenv = require('dotenv');
const env = process.argv[process.argv.length - 1];
dotenv.config({ path: `./env/.env.${ env }` });
const { database } = require('../../src/lib/database');
const { config } = require('../../src/lib');
let operations = require('../../src/modules/data-collector/operations');

describe('Data Collector operations.js', () => {
  before(() => {
    return Promise.resolve(
      database.connect.then(data => {
        return { data }
      })
    );
  });
  
  describe('Collector Module', () => {
    
    it('List Unit by ref ', async () => {
      const refId = 'A_1_1';
      const unit = await operations.listUnitByRef(refId);
      if (!unit) {
        expect(unit).to.be.null;
      } else {
        expect(unit).to.be.instanceOf(Object);
        expect(unit).to.not.be.undefined;
        expect(unit).to.be.instanceof(Object);
        expect(unit).have.keys(["_id", "ref",
          "timestamp", "asset", "createdAt", "lease_end",
          "is_rented", "lease_start", "rent", "size",
          "tenant", "type", "updatedAt"]);
      }
    });
    
    it('List Asset by ref and timestamp', async () => {
      const ref = 'A_1';
      const timestamp = '01.01.19';
      const asset = await operations.listAssetByRefAndDate({ ref, timestamp });
      
      if (!asset) {
        expect(asset).to.be.null;
      } else {
        expect(asset).to.be.instanceOf(Object);
        expect(asset).to.not.be.undefined;
        expect(asset).to.be.instanceof(Object);
        expect(asset).have.keys(["_id", "ref",
          "timestamp", "address", "city", "createdAt",
          "is_restricted", "portfolio", "updatedAt", "yoc",
          "zipcode"]);
      }
    });
  });
});


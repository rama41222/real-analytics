const expect = require('chai').expect;
const dotenv = require('dotenv');
const env = process.argv[process.argv.length - 1];
dotenv.config({ path: `./env/.env.${ env }` });
const { database } = require('../../src/lib/database');
const { config } = require('../../src/lib');
let operations = require('../../src/modules/data-delivery/operations');

describe('Delivery operations.js', () => {
  before(() => {
    return Promise.resolve(
      database.connect.then(data => {
        return { data }
      })
    );
  });
  
  describe('Delivery Module', () => {
    
    let analyticsObject;
    
    it('List all analytics', async () => {
      const opts = {};
      const sort = {};
      const assets = await operations.list(2, 0, sort, opts);
      expect(assets).to.not.be.undefined;
      expect(assets).to.have.property('total');
      expect(assets).to.have.property('analytics');
      expect(assets.analytics).to.be.instanceOf(Array);
      expect(assets.analytics.length).to.be.within(0, 2);
      expect(assets.total).to.be.a('number');
      analyticsObject = assets.analytics[0];
      return assets
    });
    
    it('List analytics object snapshot', async () => {
      if (!analyticsObject) {
        expect(analyticsObject).to.be.undefined;
      } else {
        expect(analyticsObject).to.not.be.undefined;
        expect(analyticsObject).to.be.instanceof(Object);
        expect(analyticsObject).have.keys(["_id", "latest_update",
          "address", "area_rented", "city", "number_of_units",
          "restricted_area", "total_area", "total_rent", "vacancy",
          "walt", "year_of_construction", "zipcode"]);
      }
      
    });
    
  });
});


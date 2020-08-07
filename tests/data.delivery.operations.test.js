const expect = require('chai').expect;
const dotenv = require('dotenv');
const env = process.argv[process.argv.length-1];
dotenv.config({path: `./env/.env.${env}`});
const { database } = require('./../src/lib/database');
const { config } = require('./../src/lib');
let operations = require('./../src/modules/data-delivery/operations');

describe('Delivery operations.js', () => {
  before(() => {
    return Promise.resolve(
      database.connect.then( data => {
        return {data}
      })
    );
  });
  
  describe('Delivery Module', () => {
    
    after(async ()=> {
    
    });
    
    it('List all assets', async () => {
      const assets = await operations.list(2, 0);
    });
  });
});


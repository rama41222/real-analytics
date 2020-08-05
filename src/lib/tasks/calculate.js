const EventEmitter = require('events');
const _ = require('lodash');
const moment = require('moment');
class AnalyticsEmitter extends EventEmitter {}
const analyticsEmitter = new AnalyticsEmitter();
const Analytics = require('./../../modules/data-delivery-pipeline/analytics.model');
const Asset = require('./../../modules/data-collector/asset.model');
const Unit = require('./../../modules/data-collector/unit.model');

const processUnits = async (units) => {
  const unitGroups = {};
  units.forEach(i => {
    if (unitGroups[i.asset._id]) {
      unitGroups[i.asset._id].push(i);
    } else {
      unitGroups[i.asset._id] = [i];
    }
  });
  
  Object.keys(unitGroups).forEach(ugk => {
    const ug = unitGroups[ugk];
    const reGroup = {};
    const asset = ug[0].asset;
    reGroup.asset = asset;
    ug.forEach(g => {
      delete g.asset;
      const key = keyBuilder(g.tenant, g.type, g.lease_start, g.lease_end);
      if (reGroup[key]) {
        reGroup[key].push(g);
      } else {
        reGroup[key] = [g];
      }
    });
    unitGroups[ugk] = reGroup;
  });
  return unitGroups;
};

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

const calculate = async (assetGroups) => {
  // per Asset
  const asset = assetGroups.asset;
  const calc = {
    address: asset.address,
    zipcode: asset.zipcode,
    city: asset.city,
    year_of_construction: asset.yoc,
    restricted_area: asset.is_restricted,
    latest_update: asset.timestamp,
    total_rent: 0,
    asset: asset._id,
    total_area: 0,
    number_of_units: 0,
    area_rented: 0,
    vacancy: 0,
    walt: 0,
    walt_raw_data: []
  };
  // tenant
  Object.keys(assetGroups).map(async k =>{
    if (k === 'asset') {
      return;
    }
    const units = assetGroups[k];
    // units of a single tenant
    // per tenant
    // units belong to the tenant
    let minLeaseStart = 0;
    let maxLeaseEnd = 0;
    let occupancyArea = 0;
    calc.number_of_units += units.length;
    
    for (let u of units) {
      calc.total_rent = u.rent ? calc.total_rent + u.rent || 0 : calc.total_rent;
      calc.total_area += u.size || 0;
      calc.area_rented = u.is_rented ? calc.area_rented + u.size || 0 : calc.area_rented;
      occupancyArea += u.size;
      
      if (u.lease_start) minLeaseStart = moment(u.lease_start, "DD-MM-YYYY").toDate().getFullYear();
      if (u.lease_end) maxLeaseEnd = moment(u.lease_end, "DD-MM-YYYY").toDate().getFullYear();
      
      if (minLeaseStart && maxLeaseEnd) {
        let leaseDiff = maxLeaseEnd - minLeaseStart;
        calc.walt_raw_data.push({ leaseDiff, occupancyArea });
      } else if (!maxLeaseEnd && minLeaseStart) {
        calc.walt_raw_data.push({ leaseDiff: 'NA', occupancyArea });
      }
    }
  // }
  });
  
  for (let w of calc.walt_raw_data) {
    if (w.leaseDiff === 'NA') {
      calc.walt = 'Does not contain contract end date(infinite)';
      break;
    } else {
      calc.walt += (w.occupancyArea / calc.total_area) * w.leaseDiff;
    }
  }
  
  calc.vacancy = (calc.total_area - calc.area_rented) / calc.total_area;
  calc.vacancy = calc.vacancy.toFixed(2);
  if (!isNaN(calc.walt)) calc.walt = calc.walt.toFixed(2);
  delete calc.walt_raw_data;
  return calc;
};

const createCalculations = async (calculation) => {
  const options = {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
    runValidators: true,
    context: 'query'
  };
  const res = await Analytics.
  findOneAndUpdate({
    latest_update: calculation.latest_update,
    asset: calculation.asset
  }, calculation, options)
    .catch(err => console.error('BULK update error:', err))
  console.log(res);
};

const calculationManager = async () => {
  // const asset = await Asset.findOne().sort({ timestamp: -1 });
  // const latestTime = asset.timestamp;
  const units = await Unit.find().populate('asset').exec();
  const unitGroups = await processUnits(units);
  await Object.keys(unitGroups).map(async key => {
    const asset = unitGroups[key];
    const calculation = await calculate(asset);
    console.log('c',calculation);
    await createCalculations(calculation);
  });
  
};

analyticsEmitter.on('calculate', calculationManager);
module.exports = analyticsEmitter;
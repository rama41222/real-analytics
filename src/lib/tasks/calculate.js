// const EventEmitter = require('events');
const _ = require('lodash');
const { keyBuilder } = require('./../utils');
const moment = require('moment');
// class AnalyticsEmitter extends EventEmitter {}
// const analyticsEmitter = new AnalyticsEmitter();
const Asset = require('../../modules/data-collector/models/asset');
const Unit = require('../../modules/data-collector/models/unit');
const Analytics = require('../common/models');

/**
 * Listener limit for the event emitter
 */
// analyticsEmitter.setMaxListeners(0);

/**
 * Process the units
 * @param units
 * @returns {Promise<{}>}
 */
const processUnits = async (units) => {
  // unit groups object
  const unitGroups = {};
  // Group by asset id
  units.forEach(i => {
    if (unitGroups[i.asset._id]) {
      unitGroups[i.asset._id].push(i);
    } else {
      unitGroups[i.asset._id] = [i];
    }
  });
  // For each unit group of the asset
  Object.keys(unitGroups).forEach(ugk => {
    // ukg is the asset id from above
    const ug = unitGroups[ugk];
    const reGroup = {};
    const asset = ug[0].asset;
    reGroup.asset = asset;
    /// iterate common the units
    ug.forEach(g => {
      delete g.asset;
      // Common units key
      const key = keyBuilder(g.tenant, g.type, g.lease_start, g.lease_end);
      if (reGroup[key]) {
        reGroup[key].push(g);
      } else {
        reGroup[key] = [g];
      }
    });
    unitGroups[ugk] = reGroup;
  });
  // return a unit groups unter assets
  //{ asset_id: units_group_by_tenant1: [{unit}, {unit}] }
  return unitGroups;
};

/**
 * Process the asset groups
 * @param assetGroups
 * @returns {Promise<{address: *, area_rented: number, total_area: number, city: ImportExport.city | ImportExport.city | {type, required: [boolean, string]} | {type: String | StringConstructor, required: [boolean, string]} | {type, required: [boolean, string]} | {type: String | StringConstructor, required: [boolean, string]} | string, walt: number, latest_update, total_rent: number, zipcode: ({trim: boolean, type: StringConstructor, required: [boolean, string]}|{trim: boolean, type: String | StringConstructor, required: [boolean, string]}|{trim: boolean, type: String | StringConstructor, required: [boolean, string]}), walt_raw_data: [], restricted_area, year_of_construction, asset, vacancy: number, number_of_units: number}>}
 */
const calculate = async (assetGroups) => {
  // processes an Asset sent from calculations manager
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
  // iterate per tenant belonging to an asset
  Object.keys(assetGroups).map(async k => {
    // skip the assets since only units needed to be processed
    if (k === 'asset') {
      return;
    }
    // units of a single tenant
    // per tenant
    // units belong to the tenant
    const units = assetGroups[k];
    let minLeaseStart = 0;
    let maxLeaseEnd = 0;
    let occupancyArea = 0;
    calc.number_of_units += units.length;
    // Iterates the units belonging to a single tenant
    for (let u of units) {
      // total tent is dependent on whether the unit has a rent or not
      calc.total_rent = u.rent ? calc.total_rent + u.rent || 0 : calc.total_rent;
      calc.total_area += u.size || 0;
      calc.area_rented = u.is_rented ? calc.area_rented + u.size || 0 : calc.area_rented;
      // occupancy area for a single tenant has to be calculated for the walt
      occupancyArea += u.size;
      // lease start date and end datae uses moment
      if (u.lease_start) minLeaseStart = moment(u.lease_start, "DD-MM-YYYY").toDate().getFullYear();
      if (u.lease_end) maxLeaseEnd = moment(u.lease_end, "DD-MM-YYYY").toDate().getFullYear();
      // if there's a max lease end and min lease start then we take the lease range in number of years for walt value
      if (minLeaseStart && maxLeaseEnd) {
        let leaseDiff = maxLeaseEnd - minLeaseStart;
        calc.walt_raw_data.push({ leaseDiff, occupancyArea });
      } else if (!maxLeaseEnd && minLeaseStart) {
        // sometimes if the lease end is not defined, can't calculate the walt
        calc.walt_raw_data.push({ leaseDiff: 'NA', occupancyArea });
      }
    }
  });
  
  // Processing all tenants to calculate the walt
  for (let w of calc.walt_raw_data) {
    if (w.leaseDiff === 'NA') {
      calc.walt = 'Does not contain contract end date(infinite)';
      break;
    } else {
      // walt value
      calc.walt += (w.occupancyArea / calc.total_area) * w.leaseDiff;
    }
  }
  
  // Vacancy is the opposite of area rented. Therefore calc.total_area - calc.area_rented
  calc.vacancy = (calc.total_area - calc.area_rented) / calc.total_area;
  // Rounding off the vacancy percentage to the 2 fixed digits
  calc.vacancy = calc.vacancy.toFixed(2);
  // handles when there's no walt value to prevent from null
  if (!isNaN(calc.walt)) calc.walt = calc.walt.toFixed(2);
  // Removes raw data used for calculation
  delete calc.walt_raw_data;
  // return the calculation object which will be saved in analytics table later on the pipeline
  return calc;
};

/**
 * Saving the calculations on to the database
 * @param calculation
 * @returns {Promise<any>}
 */
const createCalculations = async (calculation) => {
  // Query options. [update if exists and create new if not]
  // The compound index is the timestamp and the asset id
  const options = {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
    runValidators: true,
    context: 'query'
  };
  // Saving to the database
  const analytic = await Analytics.
  findOneAndUpdate({
    latest_update: calculation.latest_update,
    asset: calculation.asset
  }, calculation, options)
    .catch(err => console.error('update error:', err));
  // logs to console, can be seen from AWS clouds watch
  console.log('Analytics created',analytic);
  return analytic;
};

/**
 * Main handler for the calculation events
 * @returns {Promise<void>}
 */
const calculationManager = async () => {
  // Removed these latest date to allow multiple CSV files at once
  // const asset = await Asset.findOne().sort({ timestamp: -1 });
  // const latestTime = asset.timestamp;
  
  // get the units
  const units = await Unit.find().populate('asset').exec();
  // Group the units by asset
  const unitGroups = await processUnits(units);
  // For each unit group
  return Object.keys(unitGroups).map(async key => {
    const asset = unitGroups[key];
    // Group by tenant per asset and calculate walt
    const calculation = await calculate(asset);
    // Save in the database
    return await createCalculations(calculation);
  });
};

/**
 * Analytics emitter listener
 */
// analyticsEmitter.on('calculate', calculationManager);
// module.exports = analyticsEmitter;
module.exports = calculationManager;

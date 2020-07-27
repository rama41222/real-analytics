const bcrypt = require('bcryptjs');
const Asset = require('./asset.model');
const Unit = require('./unit.model');
const { config } = require('./../../lib');

/**
 * process documents and stores them accordingly
 * @param id
 * @returns {Promise<void>}
 */
const process = async(id) => {
  return User.findById(id).select({ __v: 0 }).exec();
};

/**
 * Listing a single Asset by ref
 * @param ref
 * @returns {Promise<AggregationCursor|RegExpExecArray>}
 */
const listAssetByRef = async(ref) => {
  return Asset.findOne({ ref }, { __v: 0 }).exec();
};

/**
 *  Listing a single unit by ref
 * @param ref
 * @returns {Promise<boolean>}
 */
const listUnitByRef = async(ref) => {
  const count = Unit.findOne({ ref }, { __v: 0 }).exec();
  return count > 0;
};

module.exports = {
  process,
  listUnitByRef,
  listAssetByRef
};

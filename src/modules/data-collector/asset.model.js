const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Assets Schema
 * Saves the api response from data collection api
 * @type {Mongoose.Schema}
 */
const assetSchema = new Schema({
  portfolio: {
    type: String,
    trim: true,
    required: [true, 'Portfolio is required'],
  },
  ref: {
    type: String,
    trim: true,
    required: [true, 'Reference is required'],
  },
  address:{
    type: String,
    trim: true,
    required: [true, 'Asset address is required']
  },
  zipcode: {
    type: String,
    trim: true,
    required: [true, 'Zip code is required']
  },
  is_restricted: {
    type: Boolean,
    required: [true, 'Asset location constraints required']
  },
  city: {
    type: String,
    required: [true, `City is required in ${this.ref}`]
  },
  yoc: {
    type: String,
    trim: true,
    required: [true, 'Construction year is required']
  },
  timestamp: {
    type: String,
    required: [true, 'Report time is required'],
  }
}, { strict: true, timestamps: true });

assetSchema.index({ timestamp: -1, ref: 1 }, { unique: true });
module.exports = mongoose.model('Asset', assetSchema);


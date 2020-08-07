const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Analytics Schema
 * Saves the api response from data collection api
 * @type {Mongoose.Schema}
 */
const analyticsSchema = new Schema({
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
  city: {
    type: String,
    required: [true, `City is required`]
  },
  year_of_construction: {
    type: String,
    trim: true,
    required: [true, 'Construction year is required']
  },
  number_of_units: {
    type: Number,
    required: [true, 'Number of units are required'],
  },
  restricted_area: {
    type: Boolean,
    required: [true, 'Restricted area is required']
  },
  total_rent: {
    type: Number,
    required: [true, 'Total rent is required']
  },
  total_area: {
    type: Number,
    required: [true, 'Total area is required']
  },
  area_rented: {
    type: Number,
    required: [true, 'Area required is necessary']
  },
  vacancy: {
    type: Number,
    required: [true, 'Vacancy percentage is required'],
  },
  walt: {
    type: Schema.Types.Mixed,
    required: [true, 'WALT value must be calculated']
  },
  asset: {
    type: String,
    ref: 'Asset',
    required: [true, `Asset reference is required to store the analytics`]
  },
  latest_update: {
    type: String,
    required: [true, 'Latest update time is required'],
    index: { unique: false },
  }
}, { strict: true, timestamps: true });

analyticsSchema.index({ timestamp: -1, asset: 1 }, { unique: true });
module.exports = mongoose.model('Analytics', analyticsSchema);


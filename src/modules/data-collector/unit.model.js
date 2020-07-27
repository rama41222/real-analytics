const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Unit Schema
 * Saves the api response from data collection api
 * @type {Mongoose.Schema}
 */
const unitSchema = new Schema({
  ref: {
    type: String,
    trim: true,
    required: [true, 'Reference is required'],
  },
  size: {
    type: Number,
    required: [true, `Unit size is required in ${this.ref} on ${this.data_timestamp}`],
  },
  is_rented:{
    type: Boolean,
    required: [true, 'Unit address is required']
  },
  rent: {
    type: Number,
  },
  /**
   * Add more unit types as required by the data files
   */
  type:{
    type: String,
    enum: ['RESIDENTIAL', 'OFFICE', 'RETAIL', 'COMMERCIAL'],
    required: [true, 'Unit location constraints required']
  },
  tenant: {
    type: String,
  },
  lease_start: {
    type: String,
  },
  lease_end: {
    type: String,
  },
  asset: {
    type: String,
    ref: 'Asset',
    required: [true, `Asset reference is required to store this unit ${this.ref} on ${this.data_timestamp}`]
  },
  data_timestamp: {
    type: String,
    required: [true, 'Report time is required'],
    index: { unique: false },
  }
}, { strict: true, timestamps: true });

module.exports = mongoose.model('Unit', unitSchema);


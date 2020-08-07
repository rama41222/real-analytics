const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * @Deprecated
 * Upload Schema
 * Saves the file upload response from data collection api
 * @type {Mongoose.Schema}
 */
const uploadSchema = new Schema({
  eTag: {
    type: String,
    trim: true,
    required: [true, 'Etag is required'],
  },
  location: {
    type: String,
    required: [true, `File location is needed`],
  },
  key:{
    type: String,
    required: [true, 'key is required']
  }
}, { strict: true, timestamps: true });

module.exports = mongoose.model('Upload', uploadSchema);


const multer = require('multer');
const multerS3 = require('multer-s3');
const { aws } = require('./../config');
const s3 = require('./lambda');

/**
 * Multer function to upload but the feature was never needed since the removal of cron lambda
 * @type {Multer|undefined}
 */
const uploader = multer({
  storage: multerS3({
    s3: s3,
    acl: 'public-read',
    bucket: aws.AWS_BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      console.log(file.originalname, file);
      cb(null, file.originalname); //set unique file name if you wise using Date.toISOString()
    }
  }),
  limits: { fileSize: 1024 * 1024 * 50 }, // 50MB
  fileFilter: function(req, file, cb) {
    const filetypes = /xls|xlas|csv/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    console.log(mimetype, extname, filetypes);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Allow images only of extensions jpeg|jpg|png !");
    }
  }
});

module.exports = uploader;

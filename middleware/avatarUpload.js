const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Directory to save uploaded files
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
    }
  });
  
  const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // Limit file size to 50 MB
    fileFilter: function (req, file, cb) {
      console.log("File upload started:", file.originalname);
      const filetypes = /jpeg|jpg|png|gif/;
      const mimetype = filetypes.test(file.mimetype);
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  
      if (mimetype && extname) {
        console.log("File upload passed validation:", file.originalname);
        return cb(null, true);
      }
      console.error("File upload failed validation:", file.originalname);
      cb(new Error('Error: File upload only supports the following filetypes - ' + filetypes));
    }
  });

  module.exports = upload;
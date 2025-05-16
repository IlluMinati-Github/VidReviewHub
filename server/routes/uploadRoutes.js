const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const uploadController = require('../controllers/uploadController');
const { verifyToken } = require('../middleware/auth');

// Upload files route
router.post(
  '/',
  verifyToken,
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
  ]),
  uploadController.uploadFiles
);

module.exports = router; 
const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');

// Convert buffer to stream
const bufferToStream = (buffer) => {
  return Readable.from(buffer);
};

// Upload file to Cloudinary
const uploadToCloudinary = async (file, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    bufferToStream(file.buffer).pipe(uploadStream);
  });
};

// Handle file upload
exports.uploadFiles = async (req, res) => {
  try {
    if (!req.files || (!req.files.video && !req.files.thumbnail)) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadResults = {};

    // Upload video if present
    if (req.files.video) {
      const videoResult = await uploadToCloudinary(req.files.video[0], 'videos');
      uploadResults.videoUrl = videoResult.secure_url;
    }

    // Upload thumbnail if present
    if (req.files.thumbnail) {
      const thumbnailResult = await uploadToCloudinary(req.files.thumbnail[0], 'thumbnails');
      uploadResults.thumbnailUrl = thumbnailResult.secure_url;
    }

    res.json(uploadResults);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Error uploading files' });
  }
}; 
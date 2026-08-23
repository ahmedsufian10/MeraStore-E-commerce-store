const { cloudinary } = require('../config/cloudinary');

function uploadBuffer(file) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: 'mera-store/products', resource_type: 'image' }, (error, result) => {
      if (error) reject(error);
      else resolve(result.secure_url);
    });
    stream.end(file.buffer);
  });
}

module.exports = { uploadBuffer };

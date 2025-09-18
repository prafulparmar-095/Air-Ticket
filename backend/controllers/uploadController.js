const cloudinary = require('../config/cloudinary');
const { BadRequestError } = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// Upload single image
const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new BadRequestError('Please upload an image file');
  }

  // Check file type
  if (!req.file.mimetype.startsWith('image')) {
    throw new BadRequestError('Please upload an image file');
  }

  // Check file size
  if (req.file.size > parseInt(process.env.UPLOAD_MAX_SIZE)) {
    throw new BadRequestError(`Please upload an image less than ${process.env.UPLOAD_MAX_SIZE / 1024 / 1024}MB`);
  }

  // Upload to Cloudinary
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'airticket',
      transformation: [
        { width: 800, height: 600, crop: 'limit' },
        { quality: 'auto' },
        { format: 'auto' }
      ]
    });

    res.status(200).json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height
      }
    });
  } catch (error) {
    throw new BadRequestError('Image upload failed');
  }
});

// Upload multiple images
const uploadImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new BadRequestError('Please upload image files');
  }

  // Check each file
  for (const file of req.files) {
    if (!file.mimetype.startsWith('image')) {
      throw new BadRequestError('Please upload only image files');
    }

    if (file.size > parseInt(process.env.UPLOAD_MAX_SIZE)) {
      throw new BadRequestError(`Please upload images less than ${process.env.UPLOAD_MAX_SIZE / 1024 / 1024}MB`);
    }
  }

  const uploadResults = [];

  for (const file of req.files) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'airticket',
        transformation: [
          { width: 800, height: 600, crop: 'limit' },
          { quality: 'auto' },
          { format: 'auto' }
        ]
      });

      uploadResults.push({
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height
      });
    } catch (error) {
      throw new BadRequestError('Image upload failed');
    }
  }

  res.status(200).json({
    success: true,
    data: uploadResults
  });
});

// Delete image
const deleteImage = asyncHandler(async (req, res) => {
  const { publicId } = req.params;

  if (!publicId) {
    throw new BadRequestError('Please provide image public ID');
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      res.status(200).json({
        success: true,
        message: 'Image deleted successfully'
      });
    } else {
      throw new BadRequestError('Image deletion failed');
    }
  } catch (error) {
    throw new BadRequestError('Image deletion failed');
  }
});

module.exports = {
  uploadImage,
  uploadImages,
  deleteImage
};
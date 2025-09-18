const express = require('express');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/image', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload an image' });
  }

  res.json({
    success: true,
    data: {
      url: req.file.path,
      publicId: req.file.filename
    }
  });
});

module.exports = router;
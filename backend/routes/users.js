const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserBookings,
  uploadProfileImage
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.use(protect);

router.get('/', admin, getUsers);
router.get('/:id', admin, getUser);
router.put('/:id', admin, updateUser);
router.delete('/:id', admin, deleteUser);
router.get('/:id/bookings', admin, getUserBookings);
router.post('/upload-profile', upload.single('image'), uploadProfileImage);

module.exports = router;
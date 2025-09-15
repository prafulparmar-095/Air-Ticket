import express from 'express'
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserStats
} from '../controllers/userController.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = express.Router()

router.use(authenticate)

router.get('/stats', getUserStats)

// Admin routes
router.get('/', authorize('admin'), getUsers)
router.get('/:id', authorize('admin'), getUser)
router.put('/:id', authorize('admin'), updateUser)
router.delete('/:id', authorize('admin'), deleteUser)

export default router
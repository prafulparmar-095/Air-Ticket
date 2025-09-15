import express from 'express'
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword
} from '../controllers/authController.js'
import { authenticate } from '../middleware/auth.js'
import {
  validateUserRegistration,
  validateUserLogin,
  handleValidationErrors
} from '../middleware/validation.js'

const router = express.Router()

router.post('/register', validateUserRegistration, handleValidationErrors, register)
router.post('/login', validateUserLogin, handleValidationErrors, login)
router.get('/me', authenticate, getMe)
router.put('/profile', authenticate, updateProfile)
router.put('/change-password', authenticate, changePassword)

export default router
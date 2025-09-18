const express = require('express');
const {
  createPaymentIntent,
  confirmPayment,
  getPayment,
  refundPayment
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/create-intent', createPaymentIntent);
router.post('/confirm', confirmPayment);
router.get('/:id', getPayment);
router.post('/refund', refundPayment);

module.exports = router;
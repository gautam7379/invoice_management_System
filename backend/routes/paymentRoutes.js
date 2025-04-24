const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');

// All payment routes are protected
router.post('/', protect, paymentController.addPayment);
router.get('/:invoiceId', protect, paymentController.getPaymentsByInvoice);

module.exports = router;

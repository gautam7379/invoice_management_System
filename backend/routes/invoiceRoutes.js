const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const { protect } = require('../middlewares/authMiddleware');

// All invoice routes are protected
router.post('/', protect, invoiceController.createInvoice);
router.get('/', protect, invoiceController.getInvoices);
router.put('/:id', protect, invoiceController.updateInvoiceStatus);
router.delete('/:id', protect, invoiceController.deleteInvoice);

module.exports = router;

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect } = require('../middlewares/authMiddleware');

// Protect dashboard route
router.get('/', protect, dashboardController.getDashboardStats);

module.exports = router;

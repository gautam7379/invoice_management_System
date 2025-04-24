const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Signup Route
router.post('/signup', authController.signup);

// Login Route
router.post('/login', authController.login);

// Test Route
router.get('/test', (req, res) => {
  res.send('Auth route working!');
});

module.exports = router;

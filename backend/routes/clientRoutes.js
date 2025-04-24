const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { protect } = require('../middlewares/authMiddleware');

// All client routes will be protected (only logged-in users)
router.post('/', protect, clientController.createClient);
router.get('/', protect, clientController.getClients);
router.put('/:id', protect, clientController.updateClient);
router.delete('/:id', protect, clientController.deleteClient);

module.exports = router;

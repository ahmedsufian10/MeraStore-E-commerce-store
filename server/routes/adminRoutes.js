const express = require('express');
const controller = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();
router.use(protect, isAdmin);
router.get('/stats', controller.stats);
router.get('/revenue-chart', controller.revenueChart);
router.get('/users', controller.users);
router.delete('/users/:id', controller.deleteUser);

module.exports = router;

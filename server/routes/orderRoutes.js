const express = require('express');
const { body } = require('express-validator');
const controller = require('../controllers/orderController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();
router.post('/', protect, [body('orderItems').isArray({ min: 1 }).withMessage('Order items are required.'), body('shippingAddress').isObject().withMessage('Shipping address is required.')], controller.createOrder);
router.post('/:id/pay', protect, controller.payOrder);
router.get('/my', protect, controller.getMyOrders);
router.get('/:id', protect, controller.getOrder);
router.get('/', protect, isAdmin, controller.getAllOrders);
router.put('/:id/status', protect, isAdmin, [body('status').isIn(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']).withMessage('Invalid order status.')], controller.updateStatus);
router.delete('/:id', protect, controller.cancelOrder);

module.exports = router;

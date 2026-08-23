const express = require('express');
const { body } = require('express-validator');
const controller = require('../controllers/productController');
const upload = require('../middleware/upload');
const { protect, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/', controller.getProducts);
router.get('/featured', controller.getFeatured);
router.get('/:id', controller.getProduct);
router.post('/', protect, isAdmin, upload.array('images', 6), [body('name').trim().isLength({ min: 3 }).withMessage('Product name is too short.'), body('description').isLength({ min: 20 }).withMessage('Description must be at least 20 characters.'), body('price').isFloat({ min: 0 }).withMessage('Price must be valid.'), body('stock').isInt({ min: 0 }).withMessage('Stock must be a whole number.')], controller.createProduct);
router.put('/:id', protect, isAdmin, upload.array('images', 6), [body('name').trim().isLength({ min: 3 }).withMessage('Product name is too short.'), body('description').isLength({ min: 20 }).withMessage('Description must be at least 20 characters.'), body('price').isFloat({ min: 0 }).withMessage('Price must be valid.'), body('stock').isInt({ min: 0 }).withMessage('Stock must be a whole number.')], controller.updateProduct);
router.delete('/:id', protect, isAdmin, controller.deleteProduct);
router.post('/:id/review', protect, [body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5.'), body('comment').trim().isLength({ min: 3 }).withMessage('Review is too short.')], controller.addReview);
router.delete('/:id/review/:reviewId', protect, controller.deleteReview);

module.exports = router;

const express = require('express');
const { body } = require('express-validator');
const controller = require('../controllers/categoryController');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

const router = express.Router();
router.get('/', controller.getCategories);
router.post('/', protect, isAdmin, upload.single('image'), [body('name').trim().notEmpty().withMessage('Category name is required.')], controller.createCategory);
router.put('/:id', protect, isAdmin, upload.single('image'), controller.updateCategory);
router.delete('/:id', protect, isAdmin, controller.deleteCategory);

module.exports = router;

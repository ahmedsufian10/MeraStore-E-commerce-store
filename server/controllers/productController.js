const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { uploadBuffer } = require('../utils/cloudinaryUpload');
const { cloudinary } = require('../config/cloudinary');

function checkValidation(req) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.status = 400;
    throw error;
  }
}

async function resolveImages(req, existing = []) {
  let requested = [];
  if (req.body.imageUrls) {
    try { requested = Array.isArray(req.body.imageUrls) ? req.body.imageUrls : JSON.parse(req.body.imageUrls); } catch { requested = [req.body.imageUrls]; }
  }
  const hasCloudinary = Boolean(cloudinary.config().cloud_name);
  if (!req.files?.length || !hasCloudinary) return [...requested, ...existing].filter(Boolean);
  const uploaded = await Promise.all(req.files.map(uploadBuffer));
  return [...uploaded, ...requested, ...existing].filter(Boolean);
}

async function getProducts(req, res, next) {
  try {
    const { category, brand, search, sort = 'newest', page = 1, limit = 12 } = req.query;
    const filter = {};
    if (brand) filter.brand = brand;
    if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
    if (category) {
      const categoryDoc = mongoose.isValidObjectId(category) ? category : await Category.findOne({ slug: category });
      if (categoryDoc?._id) filter.category = categoryDoc._id;
    }

    const sortMap = { 'price-asc': { price: 1 }, 'price-desc': { price: -1 }, newest: { createdAt: -1 }, 'top-rated': { ratings: -1 }, featured: { isFeatured: -1, createdAt: -1 } };
    const safeLimit = Math.min(Number(limit) || 12, 48);
    const safePage = Math.max(Number(page) || 1, 1);
    const [data, total] = await Promise.all([
      Product.find(filter).populate('category', 'name slug').sort(sortMap[sort] || sortMap.featured).skip((safePage - 1) * safeLimit).limit(safeLimit),
      Product.countDocuments(filter)
    ]);
    res.json({ data, page: safePage, pages: Math.max(Math.ceil(total / safeLimit), 1), total });
  } catch (error) { next(error); }
}

async function getFeatured(req, res, next) {
  try { res.json({ data: await Product.find({ isFeatured: true }).populate('category', 'name slug').limit(8) }); } catch (error) { next(error); }
}

async function getProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug').populate('reviews.user', 'name');
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json(product);
  } catch (error) { next(error); }
}

async function createProduct(req, res, next) {
  try {
    checkValidation(req);
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).json({ message: 'Choose a valid category.' });
    const images = await resolveImages(req);
    if (!images.length) return res.status(400).json({ message: 'Add at least one product image URL or configure Cloudinary uploads.' });
    const product = await Product.create({ ...req.body, price: Number(req.body.price), stock: Number(req.body.stock), images, category: category._id });
    res.status(201).json(product);
  } catch (error) { next(error); }
}

async function updateProduct(req, res, next) {
  try {
    checkValidation(req);
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    const images = await resolveImages(req, product.images);
    Object.assign(product, { ...req.body, price: Number(req.body.price), stock: Number(req.body.stock), images });
    const saved = await product.save();
    res.json(saved);
  } catch (error) { next(error); }
}

async function deleteProduct(req, res, next) {
  try { const deleted = await Product.findByIdAndDelete(req.params.id); if (!deleted) return res.status(404).json({ message: 'Product not found.' }); res.json({ message: 'Product deleted.' }); } catch (error) { next(error); }
}

async function addReview(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    if (product.reviews.some((review) => review.user.toString() === req.user._id.toString())) return res.status(409).json({ message: 'You already reviewed this product.' });
    product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(req.body.rating), comment: req.body.comment });
    product.numReviews = product.reviews.length;
    product.ratings = product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.numReviews;
    await product.save();
    res.status(201).json(product);
  } catch (error) { next(error); }
}

async function deleteReview(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    const review = product?.reviews.id(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found.' });
    if (review.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'You can only delete your own review.' });
    review.deleteOne();
    product.numReviews = product.reviews.length - 1;
    product.ratings = product.numReviews ? product.reviews.filter((item) => item._id.toString() !== req.params.reviewId).reduce((sum, item) => sum + item.rating, 0) / product.numReviews : 0;
    await product.save();
    res.json(product);
  } catch (error) { next(error); }
}

module.exports = { getProducts, getFeatured, getProduct, createProduct, updateProduct, deleteProduct, addReview, deleteReview };

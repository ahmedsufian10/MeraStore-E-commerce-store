const Category = require('../models/Category');
const { validationResult } = require('express-validator');
const { cloudinary } = require('../config/cloudinary');
const { uploadBuffer } = require('../utils/cloudinaryUpload');

async function resolveImage(req, existing = '') {
  if (req.file && cloudinary.config().cloud_name) return uploadBuffer(req.file);
  return req.body.image || existing;
}

async function getCategories(req, res, next) { try { res.json(await Category.find().sort({ name: 1 })); } catch (error) { next(error); } }
async function createCategory(req, res, next) { try { const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg }); res.status(201).json(await Category.create({ ...req.body, image: await resolveImage(req) })); } catch (error) { next(error); } }
async function updateCategory(req, res, next) { try { const existing = await Category.findById(req.params.id); if (!existing) return res.status(404).json({ message: 'Category not found.' }); existing.name = req.body.name ?? existing.name; existing.image = await resolveImage(req, existing.image); await existing.save(); res.json(existing); } catch (error) { next(error); } }
async function deleteCategory(req, res, next) { try { const category = await Category.findByIdAndDelete(req.params.id); if (!category) return res.status(404).json({ message: 'Category not found.' }); res.json({ message: 'Category deleted.' }); } catch (error) { next(error); } }

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };

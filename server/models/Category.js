const mongoose = require('mongoose');

function slugify(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  image: { type: String, default: '' },
  slug: { type: String, required: true, unique: true, lowercase: true }
});

categorySchema.pre('validate', function makeSlug(next) {
  if (this.name && (!this.slug || this.isModified('name'))) this.slug = slugify(this.name);
  next();
});

module.exports = mongoose.model('Category', categorySchema);

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, minlength: 3 },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 3 },
  description: { type: String, required: true, minlength: 20 },
  price: { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, min: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: { type: String, trim: true },
  images: { type: [String], validate: [(images) => images.length > 0, 'At least one image is required'] },
  stock: { type: Number, required: true, default: 0, min: 0, validate: Number.isInteger },
  ratings: { type: Number, default: 0, min: 0, max: 5 },
  numReviews: { type: Number, default: 0 },
  reviews: { type: [reviewSchema], default: [] },
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

productSchema.virtual('activePrice').get(function activePrice() {
  return this.discountPrice ?? this.price;
});

productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);

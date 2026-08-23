const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 }
}, { _id: false });

const shippingSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  province: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: { type: [orderItemSchema], required: true, validate: [(items) => items.length > 0, 'Order must contain items'] },
  shippingAddress: { type: shippingSchema, required: true },
  paymentMethod: { type: String, default: 'Stripe' },
  stripePaymentId: { type: String, default: '' },
  itemsPrice: { type: Number, required: true, min: 0 },
  shippingPrice: { type: Number, default: 0, min: 0 },
  totalPrice: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);

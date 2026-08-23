const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { sendOrderConfirmation } = require('../utils/mailer');

function getStripe() {
  return process.env.STRIPE_SECRET_KEY ? require('stripe')(process.env.STRIPE_SECRET_KEY) : null;
}

async function createOrder(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });
    const { orderItems, shippingAddress } = req.body;
    if (!Array.isArray(orderItems) || !orderItems.length) return res.status(400).json({ message: 'Your order must contain at least one item.' });
    const ids = orderItems.map((item) => item.product);
    const products = await Product.find({ _id: { $in: ids } });
    const byId = new Map(products.map((product) => [product._id.toString(), product]));
    const normalized = orderItems.map((item) => {
      const product = byId.get(item.product);
      if (!product) throw Object.assign(new Error('One of the selected products is no longer available.'), { status: 400 });
      if (product.stock < item.quantity) throw Object.assign(new Error(`${product.name} does not have enough stock.`), { status: 400 });
      return { product: product._id, name: product.name, image: product.images[0], price: product.discountPrice ?? product.price, quantity: Number(item.quantity) };
    });
    const itemsPrice = normalized.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingPrice = itemsPrice >= 75 ? 0 : 8;
    const order = await Order.create({ user: req.user._id, orderItems: normalized, shippingAddress, itemsPrice, shippingPrice, totalPrice: itemsPrice + shippingPrice });
    const stripe = getStripe();
    if (!stripe) return res.status(201).json({ order, clientSecret: 'demo_client_secret', demoMode: true });
    const intent = await stripe.paymentIntents.create({ amount: Math.round(order.totalPrice * 100), currency: 'usd', metadata: { orderId: order._id.toString() } });
    order.stripePaymentId = intent.id;
    await order.save();
    res.status(201).json({ order, clientSecret: intent.client_secret, demoMode: false });
  } catch (error) { next(error); }
}

async function payOrder(req, res, next) {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') return res.status(403).json({ message: 'You cannot pay this order.' });
    const stripe = getStripe();
    if (stripe && order.stripePaymentId) {
      const intent = await stripe.paymentIntents.retrieve(order.stripePaymentId);
      if (intent.status !== 'succeeded') return res.status(400).json({ message: 'Stripe has not confirmed this payment yet.' });
    }
    if (!order.isPaid) {
      for (const item of order.orderItems) {
        const updated = await Product.findOneAndUpdate({ _id: item.product, stock: { $gte: item.quantity } }, { $inc: { stock: -item.quantity } }, { new: true });
        if (!updated) return res.status(409).json({ message: 'Stock changed while processing the order. Please try again.' });
      }
      order.isPaid = true;
      order.paidAt = new Date();
      order.status = 'Processing';
      await order.save();
      await sendOrderConfirmation(order, order.user.email);
    }
    res.json(order);
  } catch (error) { next(error); }
}

async function getMyOrders(req, res, next) { try { res.json(await Order.find({ user: req.user._id }).sort({ createdAt: -1 })); } catch (error) { next(error); } }
async function getOrder(req, res, next) { try { const order = await Order.findById(req.params.id).populate('user', 'name email'); if (!order) return res.status(404).json({ message: 'Order not found.' }); if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') return res.status(403).json({ message: 'You cannot view this order.' }); res.json(order); } catch (error) { next(error); } }
async function getAllOrders(req, res, next) { try { const filter = req.query.status ? { status: req.query.status } : {}; res.json(await Order.find(filter).populate('user', 'name email').sort({ createdAt: -1 })); } catch (error) { next(error); } }
async function updateStatus(req, res, next) { try { const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true }); if (!order) return res.status(404).json({ message: 'Order not found.' }); res.json(order); } catch (error) { next(error); } }
async function cancelOrder(req, res, next) { try { const order = await Order.findOne({ _id: req.params.id, user: req.user._id }); if (!order) return res.status(404).json({ message: 'Order not found.' }); if (order.status !== 'Pending') return res.status(400).json({ message: 'Only pending orders can be cancelled.' }); order.status = 'Cancelled'; await order.save(); res.json(order); } catch (error) { next(error); } }

module.exports = { createOrder, payOrder, getMyOrders, getOrder, getAllOrders, updateStatus, cancelOrder };

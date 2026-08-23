const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

async function stats(req, res, next) {
  try {
    const [revenue, orders, products, customers] = await Promise.all([
      Order.aggregate([{ $match: { isPaid: true } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
      Order.countDocuments(), Product.countDocuments(), User.countDocuments({ role: 'customer' })
    ]);
    res.json({ totalRevenue: revenue[0]?.total || 0, totalOrders: orders, totalProducts: products, totalCustomers: customers });
  } catch (error) { next(error); }
}

async function revenueChart(req, res, next) {
  try {
    const since = new Date();
    since.setMonth(since.getMonth() - 5, 1);
    const data = await Order.aggregate([{ $match: { isPaid: true, createdAt: { $gte: since } } }, { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, revenue: { $sum: '$totalPrice' } } }, { $sort: { '_id.year': 1, '_id.month': 1 } }]);
    res.json(data.map((item) => ({ month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`, revenue: item.revenue })));
  } catch (error) { next(error); }
}

async function users(req, res, next) { try { res.json(await User.find({ role: 'customer' }).select('-password').sort({ createdAt: -1 })); } catch (error) { next(error); } }
async function deleteUser(req, res, next) { try { const user = await User.findOneAndDelete({ _id: req.params.id, role: 'customer' }); if (!user) return res.status(404).json({ message: 'Customer not found.' }); res.json({ message: 'Customer deleted.' }); } catch (error) { next(error); } }

module.exports = { stats, revenueChart, users, deleteUser };

const { validationResult } = require('express-validator');
const User = require('../models/User');
const { signToken, userPayload } = require('../utils/token');

function checkValidation(req) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.status = 400;
    throw error;
  }
}

async function register(req, res, next) {
  try {
    checkValidation(req);
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'An account with that email already exists.' });
    const user = await User.create({ name, email, password });
    res.status(201).json({ token: signToken(user._id), user: userPayload(user) });
  } catch (error) { next(error); }
}

async function login(req, res, next) {
  try {
    checkValidation(req);
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) return res.status(401).json({ message: 'Email or password is not correct.' });
    res.json({ token: signToken(user._id), user: userPayload(user) });
  } catch (error) { next(error); }
}

async function getMe(req, res) {
  res.json({ user: userPayload(req.user) });
}

async function updateProfile(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    user.name = req.body.name ?? user.name;
    user.email = req.body.email ?? user.email;
    user.phone = req.body.phone ?? user.phone;
    user.address = req.body.address ?? user.address;
    if (req.body.password) user.password = req.body.password;
    const saved = await user.save();
    res.json({ user: userPayload(saved) });
  } catch (error) { next(error); }
}

module.exports = { register, login, getMe, updateProfile };

const jwt = require('jsonwebtoken');

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

function userPayload(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role, address: user.address, phone: user.phone };
}

module.exports = { signToken, userPayload };

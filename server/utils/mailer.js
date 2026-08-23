const nodemailer = require('nodemailer');

function getTransporter() {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null;
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
}

async function sendOrderConfirmation(order, recipient) {
  const transporter = getTransporter();
  if (!transporter) return { sent: false, reason: 'Email service is not configured.' };

  await transporter.sendMail({
    from: process.env.FROM_EMAIL || process.env.EMAIL_USER,
    to: recipient,
    subject: `Mera Store order ${order._id}`,
    text: `Thank you for your order. Your Mera Store order number is ${order._id}. Total: ${order.totalPrice}.`
  });
  return { sent: true };
}

module.exports = { sendOrderConfirmation };

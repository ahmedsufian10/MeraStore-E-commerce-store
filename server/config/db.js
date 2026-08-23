const mongoose = require('mongoose');

async function connectDB() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is missing. Copy server/.env.example to server/.env and add your Atlas connection string.');
  }

  mongoose.set('strictQuery', false);
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000
  });
  console.log('MongoDB Atlas connected');
}

module.exports = connectDB;

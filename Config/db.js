const mongoose = require('mongoose');

const connectDB = async () => {
  try {
   await mongoose.connect('mongodb+srv://onezm555_db_user:jEkje2vpUmnl6Nvo@cluster0.x1b75a1.mongodb.net/to-do?retryWrites=true&w=majority&appName=Cluster0');
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Error connecting MongoDB:', err);
  }
};

module.exports = connectDB;
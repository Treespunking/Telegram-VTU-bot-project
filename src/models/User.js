const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  walletBalance: { type: Number, default: 0 },
  bankDetails: {
    bankName: String,
    accountNumber: String,
    accountName: String,
  },
  registeredAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: String, // change from Number to String for better compatibility (Telegram IDs)
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['AIRTIME', 'DATA', 'FUNDING', 'WITHDRAWAL'] // expandable
  },
  phone: {
    type: String
  },
  network: {
    type: String
  },
  plan: {
    type: String
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending'
  },
  provider: {
    type: String
  },
  reference: {
    type: String,
    unique: true,
    sparse: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);

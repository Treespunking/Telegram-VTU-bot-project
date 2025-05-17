require('dotenv').config();  // Load environment variables from .env

const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

// Define the Wallet schema
const walletSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  transactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
    },
  ]
}, {
  timestamps: true // Auto-manages createdAt and updatedAt
});

// 🔐 Encrypt the balance field
walletSchema.plugin(encrypt, {
  secret: process.env.ENCRYPTION_SECRET,
  encryptedFields: ['balance']
});

// Create the Wallet model
const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;

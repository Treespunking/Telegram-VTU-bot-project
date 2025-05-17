require('dotenv').config();  // Load environment variables from .env file

const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const apiProviderSchema = new mongoose.Schema({
  name: String,
  keys: mongoose.Schema.Types.Mixed, // { apiKey, secretKey }
  baseUrl: String,
  active: { type: Boolean, default: false }
});

// 🔐 Add encryption plugin
apiProviderSchema.plugin(encrypt, {
  secret: process.env.ENCRYPTION_SECRET, // Should be a 32-byte base64 string
  encryptedFields: ['keys']
});

module.exports = mongoose.model('APIProvider', apiProviderSchema);

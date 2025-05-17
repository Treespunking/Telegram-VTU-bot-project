const mongoose = require('mongoose');

const airtimePriceListSchema = new mongoose.Schema({
  network: String, // e.g. MTN, Glo
  amount: Number,  // e.g. 100, 200
  price: Number    // Actual cost (could be discounted)
});

module.exports = mongoose.model('AirtimePriceList', airtimePriceListSchema);

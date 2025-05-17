const mongoose = require('mongoose');

const dataPriceListSchema = new mongoose.Schema({
  network: String,
  plan: String,    // e.g. '1GB - 1 day', '2GB - weekly'
  price: Number
});

module.exports = mongoose.model('DataPriceList', dataPriceListSchema);

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  description: { type: String },
  image: { type: String }, // Will store image filename
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);

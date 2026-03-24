const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String }, // URL or path
  ingredients: [String],
  origin: String,
  isPure: { type: Boolean, default: true },
  isOrganic: { type: Boolean, default: false },
  stock: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);

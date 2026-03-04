const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  try {
    const { name, price, stock, description } = req.body;
    const image = req.file?.filename || '';

    const newProduct = new Product({
      name,
      price,
      stock,
      description,
      image
    });

    await newProduct.save();
    res.status(201).json({ success: true, product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};

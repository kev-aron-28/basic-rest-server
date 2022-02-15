const { request, response } = require("express");
const Product = require("../models/product");

const getProducts = async (req = request, res = response) => {
  const { limit = 5, to = 0 } = req.query;
  const products = await Product.find({ status: true })
    .populate("category", "name")
    .populate("user", "name")
    .skip(Number(to))
    .limit(Number(limit));

  res.json({
    products,
  });
};

const getProductById = async (req = request, res = response) => {
  const { id } = req.params;
  const product = await Product.findById(id)
    .populate("category", "name")
    .populate("user", "name");

  res.json({
    product,
  });
};

const createProduct = async (req = request, res = response) => {
  const { name: nameProduct, price, category, description } = req.body;
  const data = {
    name: nameProduct.toLowerCase(),
    status: true,
    user: req.user._id,
    price,
    category,
    description,
  };
  const product = new Product(data);
  await product.save();

  res.json({
    msg: "OK",
    product,
  });
};

const updateProduct = async (req = request, res = response) => {
  const { id } = req.params;
  const { name, price, description, category, avialable } = req.body;
  const data = {};
  data.user = req.user._id;
  if (name) {
    data.name = name.toLowerCase();
  }
  if (price) {
    data.price = price;
  }
  if (description) {
    data.description = description;
  }
  if (category) {
    data.category = category;
  }
  if (avialable) {
    data.avialable = avialable;
  }
  const product = await Product.findByIdAndUpdate(id, data, { new: true });
  res.json({
    product,
  });
};

const deleteProduct = async (req = request, res = response) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(
    id,
    { status: false },
    { new: true }
  );
  res.json({
    product,
  });
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};

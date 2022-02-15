const { response, request } = require("express");
const { Category } = require("../models");

const createCategory = async (req = request, res = response) => {
  const name = req.body.name.toUpperCase();
  const categoryDb = await Category.findOne({ name });
  if (categoryDb) {
    return res.status(400).json({
      msg: "La categoria ya existe",
    });
  }

  const data = {
    name,
    user: req.user._id,
  };

  const category = new Category(data);
  await category.save();
  res.status(201).json({
    category,
  });
};

const getCategories = async (req = request, res = response) => {
  const { limit = 5, to = 0 } = req.query;

  const categories = await Category.find({ status: true })
    .populate("user", "name")
    .skip(Number(to))
    .limit(Number(limit));

  res.json({
    categories,
  });
};

const getCategoryById = async (req = request, res = response) => {
  const { id } = req.params;
  const category = await Category.findById(id).populate("user", "name");
  if (!category) {
    return res.status(404).json({
      msg: "No se encontro la categoria",
    });
  }
  res.json(category);
};

const updateCategory = async (req = request, res = response) => {
  const data = {};
  const { id } = req.params;
  const { name } = req.body;
  data.name = name;
  data.id = id;
  const category = await Category.findByIdAndUpdate(id, data, { new: true });
  res.json({
    category,
  });
};

const deleteCategory = async (req = request, res = response) => {
  const { id } = req.params;
  const category = await Category.findByIdAndUpdate(
    id,
    { status: false },
    { new: true }
  );
  res.json({
    category,
  });
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};

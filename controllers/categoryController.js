const slugify = require("slugify");
const Category = require("../models/Category");
const Article = require("../models/Article");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const createCategory = async (req, res) => {
  // req.body.user = req.user.userId;
  const { name } = req.body;
  const category = await Category.create({ name, slug: slugify(name) });
  res.status(StatusCodes.CREATED).json({ category });
};
const getCategoriesTotal = async (req, res) => {
  const total = await Category.find({});
  res.status(StatusCodes.OK).json({ count: total.length });
};
const getAllCategories = async (req, res) => {
  const categories = await Category.find({});
  res.status(StatusCodes.OK).json({ categories, count: categories.length });
};

const updateCategory = async (req, res) => {
  const { id: categoryId } = req.params;
  const category = await Category.findOneAndUpdate(
    { _id: categoryId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!category) {
    throw new CustomError.NotFoundError(`No category with id ${categoryId}`);
  }
  res.status(StatusCodes.OK).json({ category });
};
const deleteCategory = async (req, res) => {
  const { id: categoryId } = req.params;
  const category = await Category.findOne({ _id: categoryId });
  if (!category) {
    throw new CustomError.NotFoundError(`No category with id ${categoryId}`);
  }
  await category.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "Success! Category removed." });
};

module.exports = {
  createCategory,
  getCategoriesTotal,
  getAllCategories,
  updateCategory,
  deleteCategory,
};

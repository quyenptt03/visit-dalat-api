const Article = require("../models/Article");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Category = require("../models/Category");

const createArticle = async (req, res) => {
  //req.body.user = req.user.userId;
  const { categorySlug } = req.body;
  const category = await Category.findOne({ categorySlug });
  if (!category) {
    throw CustomError.BadRequestError("Category doesn't exists.");
  }
  const article = await Article.create({ ...req.body, category: category._id });
  res.status(StatusCodes.CREATED).json({ article });
};
const getArticlesTotal = async (req, res) => {
  const { categories, searchQuery } = req.query;
  const queryObject = {};

  let result = Article.find({}).populate({
    path: "category",
    select: "_id name slug numOfArticles",
  });

  const articleCollection = Article.collection;

  let categoriesIDList = [];
  if (categories) {
    const categoriesList = categories.split(",");
    for (let i = 0; i < categoriesList.length; i++) {
      const cat = await Category.findOne({ slug: categoriesList[i] });
      if (cat) {
        categoriesIDList.push(cat._id);
      }
    }
    queryObject.category = { $in: categoriesIDList };
  }

  if (searchQuery) {
    queryObject.$text = { $search: searchQuery };
    await articleCollection.createIndex({ title: "text" });
  }
  result = result.find(queryObject);

  const articles = await result;
  res.status(StatusCodes.OK).json({ count: articles.length });
};

const getAllArticles = async (req, res) => {
  const { categories, searchQuery } = req.query;
  const queryObject = {};

  let result = Article.find({}).populate({
    path: "category",
    select: "_id name slug numOfArticles",
  });

  const articleCollection = Article.collection;

  let categoriesIDList = [];
  if (categories) {
    const categoriesList = categories.split(",");
    for (let i = 0; i < categoriesList.length; i++) {
      const cat = await Category.findOne({ slug: categoriesList[i] });
      if (cat) {
        categoriesIDList.push(cat._id);
      }
    }
    queryObject.category = { $in: categoriesIDList };
  }

  if (searchQuery) {
    queryObject.$text = { $search: searchQuery };
    await articleCollection.createIndex({ title: "text" });
  }
  result = result.find(queryObject);

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit);
  const skip = (page - 1) * limit;

  const articles = await result.skip(skip).limit(limit);

  res.status(StatusCodes.OK).json({ articles, count: articles.length });
};

const getFeaturedArticles = async (req, res) => {
  const articles = await Article.find({ featured: true });
  res.status(StatusCodes.OK).json({ articles, count: articles.length });
};
const getSingleArticle = async (req, res) => {
  const { id: articleId } = req.params;
  const article = await Article.findOne({
    _id: articleId,
  }).populate({
    path: "category",
    select: "_id name slug numOfArticles",
  });
  if (!article) {
    throw new CustomError.NotFoundError(`No article with id ${articleId}`);
  }
  res.status(StatusCodes.OK).json({ article });
};
const updateArticle = async (req, res) => {
  const { id: articleId } = req.params;
  const article = await Article.findOneAndUpdate({ _id: articleId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!article) {
    throw new CustomError.NotFoundError(`No article with id ${articleId}`);
  }
  res.status(StatusCodes.OK).json({ article });
};
const deleteArticle = async (req, res) => {
  const { id: articleId } = req.params;
  const article = await Article.findOne({ _id: articleId });
  if (!article) {
    throw new CustomError.NotFoundError(`No article with id ${articleId}`);
  }
  await article.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "Success! Article removed." });
};
const uploadImage = async (req, res) => {
  res.send("upload image");
};

module.exports = {
  createArticle,
  getArticlesTotal,
  getAllArticles,
  getFeaturedArticles,
  getSingleArticle,
  updateArticle,
  deleteArticle,
  uploadImage,
};

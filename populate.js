require("dotenv").config();
const connectDB = require("./db/connectDB");
const Destination = require("./models/Destination");
const Article = require("./models/Article");
const CustomError = require("./errors");

const jsonDestinations = require("./mockData/destination.json");
const jsonArticles = require("./mockData/article.json");
const Category = require("./models/Category");

const populateDestinations = async () => {
  await Destination.deleteMany();
  await Destination.create(jsonDestinations);
};

const populateArticles = async () => {
  let catSlug, category;
  //await Article.deleteMany();
  for (let i = 0; i < jsonArticles.length; i++) {
    catSlug = jsonArticles[i].category;
    category = await Category.findOne({ slug: catSlug });
    if (!category) {
      throw new CustomError.BadRequestError("Category does not exists");
    }
    await Article.create({
      ...jsonArticles[i],
      category: category._id,
    });
  }
};

const start = async () => {
  try {
    await connectDB(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@visitdalat.943fmer.mongodb.net/visit-dalat?retryWrites=true&w=majority`
    );
    await populateArticles();
    console.log("Success");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();

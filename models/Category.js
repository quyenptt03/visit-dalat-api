const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      require: [true, "Please provide category name"],
      minLength: [2, "Category name can not less than 2 characters"],
      maxLength: [100, "Category name can not more than 100 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      autoIndex: false,
      index: true,
    },
    numOfArticles: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);

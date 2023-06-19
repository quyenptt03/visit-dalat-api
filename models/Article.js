const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      require: true,
    },
    title: {
      type: String,
      require: [true, "Please provide article title"],
      maxLength: [500, "Title can not more than 500 characters"],
    },
    featuredImage: {
      type: String,
      require: [true, "Please provide article featured image"],
      default: "/uploads/article-images/example.jpeg",
    },
    lang: {
      type: String,
      enum: ["vietnamese", "english"],
      default: "vietnamese",
    },
    body: [
      {
        pTitle: {
          type: String,
          maxLength: [
            500,
            "The title of paragraph can not more than 500 characters",
          ],
        },
        pContent: {
          type: String,
        },
        image: {
          type: String,
        },
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

ArticleSchema.statics.calculateNumOfArticles = async function (categoryId) {
  const result = await this.aggregate([
    {
      $match: { category: categoryId },
    },
    {
      $group: {
        _id: null,
        numOfArticles: { $sum: 1 },
      },
    },
  ]);
  try {
    await this.model("Category").findOneAndUpdate(
      { _id: categoryId },
      {
        numOfArticles: result[0]?.numOfArticles || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

ArticleSchema.post("save", async function () {
  await this.constructor.calculateNumOfArticles(this.category);
});

ArticleSchema.post("deleteOne", { document: true }, async function () {
  await this.constructor.calculateNumOfArticles(this.category);
});

module.exports = mongoose.model("Article", ArticleSchema);

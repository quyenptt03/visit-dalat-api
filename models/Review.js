const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please provide the rating"],
    },
    title: {
      type: String,
      trim: true,
      maxLength: 100,
      required: [true, "Please provide the review title"],
    },
    comment: {
      type: String,
      required: [true, "Please provide the review text"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    destination: {
      type: mongoose.Schema.ObjectId,
      ref: "Destination",
      required: true,
    },
  },
  { timestamps: true }
);

ReviewSchema.index({ destination: 1, user: 1 }, { unique: true });

ReviewSchema.statics.calculateAverageRating = async function (destinationId) {
  const result = await this.aggregate([
    {
      $match: { destination: destinationId },
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);
  try {
    await this.model("Destination").findOneAndUpdate(
      { _id: destinationId },
      {
        averageRating: Number(result[0]?.averageRating.toFixed(1)) || 0,
        numOfReviews: result[0]?.numOfReviews || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

ReviewSchema.post("save", async function () {
  await this.constructor.calculateAverageRating(this.destination);
});

ReviewSchema.post("deleteOne", { document: true }, async function () {
  await this.constructor.calculateAverageRating(this.destination);
});

module.exports = mongoose.model("Review", ReviewSchema);

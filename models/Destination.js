const mongoose = require("mongoose");

const DestinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide destination name"],
      maxLength: [400, "Name can not be more than 400 characters"],
    },
    pricePerTicket: {
      type: Number,
      required: [true, "Please provide the price of ticket"],
      default: 0,
    },
    timePerTicket: {
      type: Number,
      required: [true, "Please provide the time of ticket (minute)"],
      default: 0,
    },
    openingTime: {
      type: String, //hh:mm
      required: [true, "Please provide the opening time"],
      default: "00:00",
    },
    closingTime: {
      type: String, //hh:mm
      required: [true, "Please provide the closing time"],
      default: "00:00",
    },
    address: {
      type: String,
      required: [true, "Please provide destination address"],
      maxLength: 500,
    },
    latitude: {
      type: Number,
      required: [true, "Please provide destination latitude"],
    },
    longitude: {
      type: Number,
      required: [true, "Please provide destination longitude"],
    },
    description: {
      type: String,
      required: [true, "Please provide destination description"],
      maxLength: [2000, "Description can not be more than 2000 characters"],
    },
    image: {
      type: String,
      default: "/uploads/example.png",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

DestinationSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "destination",
  justOne: false,
});

DestinationSchema.pre("deleteOne", { document: true }, async function () {
  await this.model("Review").deleteMany({ destination: this._id });
});

module.exports = mongoose.model("Destination", DestinationSchema);

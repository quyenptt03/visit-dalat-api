const Review = require("../models/Review");
const Destination = require("../models/Destination");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermission } = require("../utils");

const createReview = async (req, res) => {
  const { destination: destinationId } = req.body;

  const isValidProduct = await Destination.findOne({ _id: destinationId });
  if (!isValidProduct) {
    throw new CustomError.NotFoundError(
      `No destination with id: ${destinationId}`
    );
  }

  const alreadySubmitted = await Review.findOne({
    user: req.user.userId,
    destination: destinationId,
  });
  if (alreadySubmitted) {
    throw new CustomError.BadRequestError(
      "Already submitted with this destination"
    );
  }

  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({}).populate({
    path: "destination",
    select: "name pricePerTicket timePerTicket",
  });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
  }
  res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { rating, title, comment } = req.body;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
  }

  checkPermission(req.user, review.user);

  review.rating = rating;
  review.title = title;
  review.comment = comment;

  await review.save();
  res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;

  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
  }

  checkPermission(req.user, review.user);

  await review.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "Success! Review deleted" });
};

const getSingleDestinationReviews = async (req, res) => {
  const { id: destinationId } = req.params;
  const reviews = await Review.find({ destination: destinationId });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleDestinationReviews,
};

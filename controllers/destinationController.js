const Destination = require("../models/Destination");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const createDestination = async (req, res) => {
  //req.body.user = req.user.userId;
  const destination = await Destination.create(req.body);
  res.status(StatusCodes.CREATED).json({ destination });
};
const getDestinationsTotal = async (req, res) => {
  const total = await Destination.find({});
  res.status(StatusCodes.OK).json({ count: total.length });
};
const getAllDestinations = async (req, res) => {
  let result = Destination.find({});

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const destinations = await result.skip(skip).limit(limit);
  res.status(StatusCodes.OK).json({ destinations, count: destinations.length });
};
const getFeaturedDestinations = async (req, res) => {
  const destinations = await Destination.find({ featured: true });
  res.status(StatusCodes.OK).json({ destinations, count: destinations.length });
};
const getSingleDestination = async (req, res) => {
  const { id: destinationId } = req.params;
  const destination = await Destination.findOne({
    _id: destinationId,
  }).populate("reviews");
  if (!destination) {
    throw new CustomError.NotFoundError(
      `No destination with id ${destinationId}`
    );
  }
  res.status(StatusCodes.OK).json({ destination });
};
const updateDestination = async (req, res) => {
  const { id: destinationId } = req.params;
  const destination = await Destination.findOneAndUpdate(
    { _id: destinationId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!destination) {
    throw new CustomError.NotFoundError(
      `No destination with id ${destinationId}`
    );
  }
  res.status(StatusCodes.OK).json({ destination });
};
const deleteDestination = async (req, res) => {
  const { id: destinationId } = req.params;
  const destination = await Destination.findOne({ _id: destinationId });
  if (!destination) {
    throw new CustomError.NotFoundError(
      `No destination with id ${destinationId}`
    );
  }
  await destination.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "Success! Destination removed." });
};
const uploadImage = async (req, res) => {
  res.send("upload image");
};

module.exports = {
  createDestination,
  getDestinationsTotal,
  getAllDestinations,
  getFeaturedDestinations,
  getSingleDestination,
  updateDestination,
  deleteDestination,
  uploadImage,
};

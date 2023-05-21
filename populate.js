require("dotenv").config();
const connectDB = require("./db/connectDB");
const Destination = require("./models/Destination");

const jsonDestinations = require("./mockData/destination.json");

const start = async () => {
  try {
    await connectDB(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@visitdalat.943fmer.mongodb.net/visit-dalat?retryWrites=true&w=majority`
    );
    await Destination.deleteMany();
    await Destination.create(jsonDestinations);
    console.log("Success");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();

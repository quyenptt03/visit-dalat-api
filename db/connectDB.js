const mongoose = require("mongoose");

const connectDB = (url) => {
  return mongoose
    .connect(url)
    .then(() => console.log("connect db successful"))
    .catch((err) => console.log("error: ", err));
};

module.exports = connectDB;

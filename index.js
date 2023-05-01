require("dotenv").config();
// express
const express = require("express");
const app = express();
// other packets
const morgan = require("morgan");

//database
const connectDB = require("./db/connectDB");
//middleware
const notFoundMiddleware = require("./middleware/not-found.js");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(morgan("tiny"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from my app");
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@visitdalat.943fmer.mongodb.net/visit-dalat?retryWrites=true&w=majority`
    );
    app.listen(port, console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();

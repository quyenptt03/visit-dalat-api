require('dotenv').config();
require('express-async-errors');
// express
const express = require('express');
const app = express();
// rest of the packages
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
//database
const connectDB = require('./db/connectDB');
// routes
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const destinationRouter = require('./routes/destinationRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const categoryRouter = require('./routes/categoryRoutes');
const articleRouter = require('./routes/articleRoutes');
//middleware
const notFoundMiddleware = require('./middleware/not-found.js');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(cors());

app.use(express.static('./public'));

app.get('/', (req, res) => {
  res.send('Hello from my app');
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/destinations', destinationRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/articles', articleRouter);

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

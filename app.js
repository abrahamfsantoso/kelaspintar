const mongoose = require('mongoose');
const dotenv = require('dotenv');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const randomRouter = require('./routes/random');
const reportRouter = require('./routes/reports')

// dotenv
dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});

const app = express();

// CORS
const cors = require('cors');
app.use(cors());

// Mongoose
mongoose
  .connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log('DB Connection Successful!'))
  .catch((err) => {
    console.log(err);
  });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter)
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/random', randomRouter);
app.use('/reports', reportRouter);

const PORT = 5000 || process.env.PORT;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
  });
}

module.exports = app;

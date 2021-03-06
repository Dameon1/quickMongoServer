'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');

const app = express();

//filler testing data 2 arrays with 5 objects each
const {catsData, dogsData} = require("./db/seedData");

//example routers for endpoints
// const {router: usersRouter} = require('./routes/users');
// const {router: authRouter} = require('./routes/auth');
const {router: exampleRouter} = require('./routes/example');
const {router: exampleRouter2} = require('./routes/example2');

//for protecting endpoints for user created accounts
// const passport = require('passport');
// const localStrategy = require('./passport/local');
// const jwtStrategy = require('./passport/jwt');

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

// Parse request body
app.use(express.json());

//Cross-Origin
app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

//protecting endpoints
//passport.use(localStrategy);
//passport.use(jwtStrategy);

//basic endpoint to make sure its working
app.get('/cats',(req,res,next) => {
  res.json(catsData);
})
app.get('/dogs',(req,res,next) => {
  res.json(dogsData);
})

//mounting routers here
app.use('/api/example', exampleRouter);
app.use('/api/example2', exampleRouter2);

//these routes are used for testing with mocha and chai and are not used in the functionality of this program
//app.use('/api/users', usersRouter);
//app.use('/api/login', authRouter);

// Catch-all 404
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Catch-all Error handler
// Add NODE_ENV check to prevent stacktrace leak
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: app.get('env') === 'development' ? err : {}
  });
});

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = app;
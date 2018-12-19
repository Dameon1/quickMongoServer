'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');

// Connecting a SQL database using KNEX ('required')
// const {dbConnect} = require('./db-knex');
const app = express();

//testing data
const {catsData, dogsData} = require("./db/seedData");


//example routers for endpoints
const {router: usersRouter} = require('./routes/users');
const {router: authRouter} = require('./routes/auth');
const {router: exampleRouter} = require('./routes/example');

//for protecting endpoints
const passport = require('passport');
const localStrategy = require('./passport/local');
const jwtStrategy = require('./passport/jwt');


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
passport.use(localStrategy);
passport.use(jwtStrategy);

//basic endpoint to make sure its working
app.get('/cats',(req,res,next) => {
  res.json(catsData);
})
app.get('/dogs',(req,res,next) => {
  res.json(dogsData);
})

//create routers for this to work aka mounting
app.use('/api/users', usersRouter);
app.use('/api/login', authRouter);
app.use('/api/example', exampleRouter);

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

module.exports = { app };

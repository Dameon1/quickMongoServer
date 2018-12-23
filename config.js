'use strict';

// When deploying, update your environmental variable to match

module.exports = {
  
  //Port is where your server is located, update your env variables where deployed
  PORT: process.env.PORT || 8080,
  
  //Client Origin is where the Frontend is located
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  
  //create a database using mLab or another mongo client and put uri here
  DATABASE_URL: process.env.DATABASE_URL  || 'Testing String',
  
  //for protecting endpoints
  JWT_SECRET: process.env.JWT_SECRET || 'Testing String',
  JWT_EXPIRY: process.env.JWT_EXPIRY || 'Testing String',

  //Test Database here
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'mongodb://dev:d3vd3v@ds042688.mlab.com:42688/testingmongo'
};

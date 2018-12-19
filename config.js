'use strict';

module.exports = {
  //Port is where your server is located
  PORT: process.env.PORT || 8080,
  //Client Origin is where the Frontend is located
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  //create a database using mLab or another mongo client and put uri here
  DATABASE_URL: process.env.DATABASE_URL ,
  //for protecting endpoints
  JWT_SECRET: process.env.JWT_SECRET ,
  JWT_EXPIRY: process.env.JWT_EXPIRY,
};

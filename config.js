'use strict';

module.exports = {
  PORT: process.env.PORT || 8080,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  
  //create a database using mLab or another mongo client
  DATABASE_URL:
        process.env.DATABASE_URL || 'mongodb://dev:d3vd3v@ds137340.mlab.com:37340/example',
  
  //for protecting endpoints
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '7d',
};

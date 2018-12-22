'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const mongoose = require('mongoose');

const expect = chai.expect;
chai.use(chaiHttp);

//Create a test database and connect
const {TEST_DATABASE_URL} = require('../config');
const {dbConnect, dbDisconnect} = require('../db-mongoose');


// Set NODE_ENV to `test` to disable http layer logs
// You can do this in the command line, but this is cross-platform
process.env.NODE_ENV = 'test';

// Clear the console before each run
process.stdout.write('\x1Bc\n');


describe('quickServerMongo', function () {
before(function() {
  return dbConnect(TEST_DATABASE_URL);
});

after(function() {
  //mongoose.disconnect();
 //dbDisconnect();
});

describe('Mocha and Chai', function() {
  it('should be properly setup', function() {
    expect(true).to.be.true;
  });
});

describe('Environment', () => {

  it('NODE_ENV should be "test"', () => {
    expect(process.env.NODE_ENV).to.equal('test');
  });

});
  describe('404 handler', () => {

    it('should respond with 404 when given a bad path', () => {
      return chai.request(app)
        .get('/bad/path')
        .catch(err => err.response)
        .then(res => {
          expect(res).to.have.status(404);
        });
    });

  });
});
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
const config = require('../config');
const seedExample = require('../db/seed/example');
const seedExample2 = require('../db/seed/example2');
const TestExample_1 = require('../models/TestExample_1');
const TestExample_2 = require('../models/TestExample_2');


// Set NODE_ENV to `test` to disable http layer logs
// You can do this in the command line, but this is cross-platform
process.env.NODE_ENV = 'test';

// Clear the console before each run
process.stdout.write('\x1Bc\n');


describe('quickServerMongo', function () {
  before(function () {
    return mongoose.connect(TEST_DATABASE_URL)
      .then(() => mongoose.connection.db.dropDatabase());
  });
  beforeEach(function () {
    return Promise.all([TestExample_1.insertMany(seedExample),TestExample_2.insertMany(seedExample2),
    TestExample_1.createIndexes()])
  });
  
  afterEach(function () {
    return mongoose.connection.db.dropDatabase();
  });
  
  after(function () {
    return mongoose.disconnect();
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
        .get('/')
        .catch(err => err.response)
        .then(res => {
          expect(res).to.have.status(404);
        });
    });
  });

});
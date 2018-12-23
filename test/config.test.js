'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const config = require('../config');
const mongoose = require('mongoose');
const seedExample = require('../db/seed/example');
const seedExample2 = require('../db/seed/example2');
const TestExample_1 = require('../models/TestExample_1');
const TestExample_2 = require('../models/TestExample_2');
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

  describe('Basic Setup', function() {
    it('should be properly setup', function() {
      expect(true).to.be.true;
    });
  });

  describe('Port', () => {
    it('should return the port number 8080', () => {
      expect(config.PORT).to.equal(8080)
    })
  })

  describe('Client Origin', () => {
    it('should return the client url expected', () => {
      expect(config.CLIENT_ORIGIN).to.equal('http://localhost:3000')
    })
  })

  describe('DATABASE_URL', () => {
    it('should return the database url expected', () => {
      expect(config.DATABASE_URL).to.equal('Testing String')
    })
  })

  describe('JWT_EXPIRY', () => {
    it('should return the the amount of time before token expires', () => {
      expect(config.JWT_EXPIRY).to.equal('Testing String')
    })
  })

  describe('JWT_SECRET', () => {
    it('should return the port the secret for jwt', () => {
      expect(config.JWT_SECRET).to.equal('Testing String')
    })
  })
});
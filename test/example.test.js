'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
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
  // before(function() {
  //   return dbConnect(TEST_DATABASE_URL);
  // });

  // after(function() {
  //   dbDisconnect();
  // });

  describe('Basic Setup', function() {
    it('should be properly setup', function() {
      expect(true).to.be.true;
    });
  });


  describe('GET /api/example', function () {
    it('should return the correct number of examples', function () {
      return chai.request(app)
      .get('/api/example')
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(seedExample.length);
        });
    });

    it('should return a list with the correct right fields', function () {
         return chai.request(app)
      .get('/api/example')
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(seedExample.length);
          res.body.forEach(function (item) {
            expect(item).to.be.a('object');
            expect(item).to.have.keys('id', 'title', 'content', 'createdAt', 'updatedAt', 'TestExample_2Id');
          });
        });
    });

    it('should return correct search results for a searchTerm query', function () {
      const searchTerm = 'gaga';
      const re = new RegExp(searchTerm, 'i');
      const dbPromise = TestExample_1.find({       
        title:{$regex: re}
      });
      const apiPromise = chai.request(app)
        .get(`/api/example?searchTerm=${searchTerm}`)

      return Promise.all([dbPromise, apiPromise])
        .then(([data, res]) => {     
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(1);
          expect(res.body[0]).to.be.an('object');
          expect(res.body[0].id).to.equal(data[0].id);
        });
    });

    it('should return correct search results for a example2 query', function () {
      let dbPromiseResolve;
      let apiPromiseResolve;
      const searchTerm = 'breed';
      const re = new RegExp(searchTerm, 'i');
      const dbPromise = TestExample_2.find({ name:{$regex: re} });
      const apiPromise = chai.request(app).get(`/api/example2/?searchTerm=${searchTerm}`);
      
      return Promise.all([dbPromise, apiPromise])
        .then(([_dbPromiseResolve, _apiPromiseResolve]) => {
          apiPromiseResolve = _apiPromiseResolve;
          dbPromiseResolve = _dbPromiseResolve;
          return TestExample_1.find({TestExample_2Id:dbPromiseResolve[0].id})        
        .then((_dbPromise) => {          
          expect(apiPromiseResolve).to.have.status(200);
          expect(apiPromiseResolve).to.be.json;
          expect(apiPromiseResolve.body).to.be.a('array');
          expect(apiPromiseResolve.body).to.have.length(1);
          expect(_dbPromise).to.have.length(3);
        });
    }); 
  });


    it('should return an empty array for an incorrect query', function () {
      const searchTerm = 'NotValid';
      return Promise.all([
        TestExample_1.find({
          title: {
            $regex: searchTerm
          }
        }),
        chai.request(app).get(`/api/example?searchTerm=${searchTerm}`)
      ])
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
        });
    }); 
  });

  describe('GET /api/example/:id', function () {
    it('should return correct TestExample_1', function () {
      let data;
      return TestExample_1.findOne()
        .then(_data => {
          data = _data;
          return chai.request(app).get(`/api/example/${data.id}`);
        })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys('id', 'title', 'content', 'createdAt', 'updatedAt', 'TestExample_2Id');
          expect(res.body.id).to.equal(data.id);
          expect(res.body.title).to.equal(data.title);
          expect(res.body.content).to.equal(data.content);
        });
    });

    it('should respond with status 400 and an error message when `id` is not valid', function () {
      return chai.request(app)
        .get('/api/example/INVALID')
        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.eq('The `id` is not valid');
        });
    });

    it('should respond with a 404 for an invalid id', function () {
      return chai.request(app)
        .get('/api/example/AAAAAAAAAAAAAAAAAAAAAAAA')
        .then(res => {
          expect(res).to.have.status(404);
        });
    });
  });

  describe('POST /api/example', function () {

    it('should create and return a new item when provided valid data', function () {
      const newItem = {
        'title': 'The best article about cats ever!',
        'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...',
        'TestExample_2Id':"111111111111111111111100"
      };
      let res;
      return chai.request(app)
        .post('/api/example')
        .send(newItem)
        .then(function (_res) {
          res = _res;
          expect(res).to.have.status(201);
          expect(res).to.have.header('location');
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys('id', 'title', 'content', 'createdAt', 'updatedAt', 'TestExample_2Id');
          return TestExample_1.findById(res.body.id);
        })
        .then(data => {
          expect(res.body.title).to.equal(data.title);
          expect(res.body.content).to.equal(data.content);
        });
    });

    it('should return an error when posting an object with a missing "title" field', function () {
      const newItem = {
        'content': 'Lorem ipsum dolor sit amet, sed do eiusmod tempor...'
      };
      return chai.request(app)
        .post('/api/example')
        .send(newItem)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Missing `title` in request body');
        });
    });

  });

  describe('PUT /api/example/:id', function () {

    it('should update the TestExample_1 when provided proper valid data', function () {
      const updateItem = {
        'title': 'What about dogs?!',
        'content': 'woof woof'
      };
      let data;
      return TestExample_1.findOne()
        .then(_data => {
          data = _data;
          return chai.request(app)
            .put(`/api/example/${data.id}`)
            .send(updateItem);
        })
        .then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys('id', 'title', 'content', 'createdAt', 'updatedAt', 'TestExample_2Id');

          expect(res.body.id).to.equal(data.id);
          expect(res.body.title).to.equal(updateItem.title);
          expect(res.body.content).to.equal(updateItem.content);
        });
    });


    it('should respond with status 400 and an error message when `id` is not valid', function () {
      const updateItem = {
        'title': 'What about dogs?!',
        'content': 'woof woof'
      };

      return chai.request(app)
        .put('/api/example/INVALID')
        .send(updateItem)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.eq('The `id` is not valid');
        });
    });

    it('should respond with a 400 for an invalid id', function () {
      const updateItem = {
        'title': 'What about dogs?!',
        'content': 'woof woof'
      };
      return chai.request(app)
        .put('/api/example/AAAAAAAAAAAAAAAAAAA')
        .send(updateItem)
        .then(res => {
          expect(res).to.have.status(400);
        });
    });

    it('should respond with status 400 and an error message when `id` is not valid', function () {
      const updateItem = {};
      return chai.request(app)
        .put('/api/example/INVALID')
        .send(updateItem)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('The `id` is not valid');
        });
    });

    it('should return an error when missing "title" field', function () {
      const updateItem = {
        'foo': 'bar'
      };
      let data;
      return TestExample_1.findOne()
        .then(_data => {
          data = _data;
          return chai.request(app)
            .put(`/api/example/${data.id}`)
            .send(updateItem);
        })
        .then(res => {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Missing `title` in request body');
        });
    });

  });

  describe('DELETE /api/example/:id', function () {

    it('should delete an existing document and respond with 204', function () {
      let data;
      return TestExample_1.findOne()
        .then(_data => {
          data = _data;
          return chai.request(app)          
          .delete(`/api/example/${data.id}`)
        })
        .then(function (res) {
          expect(res).to.have.status(204);
          return TestExample_1.count({
            _id: data.id
          });
        })
        .then(count => {
          expect(count).to.equal(0);
        });
    });

    it('should respond with 400 when document does not exist', function () {
      return chai.request(app)      
      .delete('/api/example/a')
        .then((res) => {
          expect(res).to.have.status(400);
        });
    });
    
      it('should delete an item by id', function () {
        return chai.request(app)
          .delete('/api/example/000000000000000000000000')
          .then(function (res) {
            expect(res).to.have.status(204);         
          });
      
    })

  });
 


  
});

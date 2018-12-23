'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const TestExample_1 = require('../models/TestExample_1');
const TestExample_2 = require('../models/TestExample_2');
const passport = require('passport');

// Enable this for protecting the endpoints
//router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

// validation for ID functions
function validateTestExample_2Id(TestExample_2Id, /*userId*/) {
  if (TestExample_2Id === undefined) {
    return Promise.resolve();
  }
  if (!mongoose.Types.ObjectId.isValid(TestExample_2Id)) {
    const err = new Error('The `TestExample_2Id` is not valid');
    err.status = 400;
    return Promise.reject(err);
  }
  return TestExample_2.count({ _id: TestExample_2Id, /*userId*/ })
    .then(count => {
      if (count === 0) {
        const err = new Error('The `TestExample_2Id` is not valid');
        err.status = 400;
        return Promise.reject(err);
      }
    });
}

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const { searchTerm, TestExample_2Id} = req.query;
  //const/*userId*/ = req.user.id;
  
  let filter = {};
  //filter.userId=userId;
  
  if (searchTerm) {
    // filter.title = { $regex: searchTerm };
    filter.$or = [{ 'title': { $regex: searchTerm } }, { 'content': { $regex: searchTerm } }];
  }

  if (TestExample_2Id) {
    filter.TestExample_2Id = TestExample_2Id;
  }  

  TestExample_1.find(filter)
    .sort({ 'updatedAt': 'desc' })
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  //const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }
  //add userId as arg
  TestExample_1.findOne({ _id: id },/*userId*/)
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  const { title, content, TestExample_2Id, example} = req.body;
  
  //this id is should be on the user object
  //const /*userId*/ = req.user.id;

  /***** Never trust users - validate input *****/
  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  if (TestExample_2Id && !mongoose.Types.ObjectId.isValid(TestExample_2Id)) {
    const err = new Error('The `TestExample_2Id` is not valid');
    err.status = 400;
    return next(err);
  } 

  Promise.all([
    validateTestExample_2Id(TestExample_2Id,/*userId*/),
    
  ])
    .then(() =>  TestExample_1.create({ title, content, example, TestExample_2Id, /*userId*/}))
    .then(result => {
      res
        .location(`${req.originalUrl}/${result.id}`)
        .status(201)
        .json(result);
    })
    .catch(err => {
      next(err);
    });
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const { title, content, TestExample_2Id} = req.body;

  //this id is should be on the user object
  //const /*userId*/ = req.user.id;

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  if (TestExample_2Id && !mongoose.Types.ObjectId.isValid(TestExample_2Id)) {
    const err = new Error('The `TestExample_2Id` is not valid');
    err.status = 400;
    return next(err);
  }
  
  Promise.all([
    validateTestExample_2Id(TestExample_2Id, /*userId*/),
   
  ])
    .then(() => TestExample_1.findOneAndUpdate(id, { title, content, TestExample_2Id, /*userId*/}, { new: true }))
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;  
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }
  //const /*userId*/ = req.user.id;

  TestExample_1.findOneAndRemove({_id:id,/*userId*/})
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      next(err);
    });
});

module.exports = {router};
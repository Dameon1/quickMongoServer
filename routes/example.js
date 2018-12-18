'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Example1 = require('../models/Example1');
const Example2 = require('../models/Example2');
const passport = require('passport');

//protecting the endpoints
//router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

//?
function validateExample2Id(Example2Id, userId) {
  if (Example2Id === undefined) {
    return Promise.resolve();
  }
  if (!mongoose.Types.ObjectId.isValid(Example2Id)) {
    const err = new Error('The `Example2Id` is not valid');
    err.status = 400;
    return Promise.reject(err);
  }
  return Example2.count({ _id: Example2Id, userId })
    .then(count => {
      if (count === 0) {
        const err = new Error('The `Example2Id` is not valid');
        err.status = 400;
        return Promise.reject(err);
      }
    });
}

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const { searchTerm, Example2Id} = req.query;
  //const userId = req.user.id;
  
  let filter = {};
  //filter.userId=userId;
  
  if (searchTerm) {
    // filter.title = { $regex: searchTerm };
    filter.$or = [{ 'title': { $regex: searchTerm } }, { 'content': { $regex: searchTerm } }];
  }

  if (Example2Id) {
    filter.Example2Id = Example2Id;
  }  

  Example1.find(filter)
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
  Example1.findOne({ _id: id })
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
  //remove userId from req.body
  const { title, content, example2Id, userId } = req.body;
  console.log(title,content, example2Id, userId);
  
  //this id is should be on the user object
  //const userId = req.user.id;

  /***** Never trust users - validate input *****/
  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  if (example2Id && !mongoose.Types.ObjectId.isValid(example2Id)) {
    const err = new Error('The `Example2Id` is not valid');
    err.status = 400;
    return next(err);
  } 

  Promise.all([
    validateExample2Id(example2Id, userId),
    
  ])
    .then(() =>  Example1.create({ title, content, example2Id, userId }))
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
  //remove userId from req.body
  const { title, content, Example2Id, userId} = req.body;

  //this id is should be on the user object
  //const userId = req.user.id;

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

  if (Example2Id && !mongoose.Types.ObjectId.isValid(Example2Id)) {
    const err = new Error('The `Example2Id` is not valid');
    err.status = 400;
    return next(err);
  }

  
  Promise.all([
    validateExample2Id(Example2Id, userId),
   
  ])
    .then(() => Example1.findOneAndUpdate(id, { title, content, Example2Id, userId }, { new: true }))
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
  const { userId } = req.body;

  //userId should be on user object
  //const {userId} = req.user.id;

  Example1.findOneAndRemove({_id:id,userId})
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      next(err);
    });
});

module.exports = {router};
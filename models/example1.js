'use strict';

const mongoose = require('mongoose');

const example1Schema = mongoose.Schema({
  title: {type: String,required: true },
  content: String,
  example2Id: {  type: mongoose.Schema.Types.ObjectId, 
    ref: 'example2'},  
  userId: { type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', required: true }
}, { timestamps: true});


example1Schema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Example1', example1Schema);
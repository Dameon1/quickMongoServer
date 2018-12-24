'use strict';

const mongoose = require('mongoose');

const TestExample_1Schema = mongoose
  .Schema({
    title: {type: String,required: true },
    content: String,
    example: String,
    TestExample_2Id: {  type: mongoose.Schema.Types.ObjectId, 
      ref: 'TestExample_2'},
    
      /* To add a user to Schema  
    userId: { type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', required: true } */
  }, 
  //options
  { timestamps: true});


TestExample_1Schema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('TestExample_1', TestExample_1Schema);
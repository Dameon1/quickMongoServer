'use strict';

const mongoose = require('mongoose');

const TestExample_2Schema = mongoose
  .Schema({
    name: { type: String},
    /* to add a reference to a user
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    */
  }, 
  //options
  { timestamps: true }
);

//TestExample_2Schema.index({ name: 1, userId: 1}, { unique: true });

TestExample_2Schema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('TestExample_2', TestExample_2Schema);
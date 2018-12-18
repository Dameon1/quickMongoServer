'use strict';

const mongoose = require('mongoose');

const example2Schema = mongoose.Schema({
  name: { type: String},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });


example2Schema.index({ name: 1, userId: 1}, { unique: true });

example2Schema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Example2', example2Schema);
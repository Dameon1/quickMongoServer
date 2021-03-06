/* This file is not used for the purposes of this program
   Use file if want to create user accounts WITH validation */

/*  'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// ===== Define UserSchema & UserModel =====

const UserSchema = new mongoose.Schema({
  fullname: { type: String },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

UserSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
  }
});

UserSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function (password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model('User',UserSchema);

module.exports = User;
*/
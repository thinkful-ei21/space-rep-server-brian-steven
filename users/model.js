'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {type: String, default: ''},
  lastName: {type: String, default: ''},
  questionsList: [
    {
      question: String,
      answer: String,
      mValue: Number,
      next: Number
    }
  ],
  head: {type: Number }
});

UserSchema.methods.serialize = function() {

  return {
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || '',
    question: this.questionsList[this.head] || '',
    id: this._id || ''
  };
};

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

UserSchema.set('timestamps', true);

UserSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = {User};
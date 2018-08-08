'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const QuestionsListSchema = mongoose.Schema({
	value: { type: String, required: true },
	next: { type: mongoose.Schema.Types.ObjectId, ref: 'QuestionsList', default: null}
});

// QuestionsListSchema.methods.serialize = function() {
// 	let array = [];
// 	while()
// }

QuestionsListSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
  }
});
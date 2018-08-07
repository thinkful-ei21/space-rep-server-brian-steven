'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const QuestionSchema = mongoose.Schema({
	question: { type: String, required: true },
	answer: { type: String, required: true }
});

QuestionSchema.set('timestamps', true);

QuestionSchema.set('toObject', {
	virtuals: true,
	versionKey: false,
	transform: (doc, ret) => {
		delete ret._id;
	}
});

const Question = mongoose.model('Question', QuestionSchema);
module.exports = {Question};
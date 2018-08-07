'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const QuizSchema = mongoose.Schema({
	title: { type: String, required: true, unique: true },
	notecards: { type: mongoose.Schema.Types.ObjectId, ref: 'Notecard'}
});

QuizSchema.set('timestamps', true);

QuizSchema.set('toObject', {
	virtuals: true,
	versionKey: false,
	transform: (doc, ret) => {
		delete ret._id;
	}
});

const Quiz = mongoose.model('Quiz', QuizSchema);
module.exports = {Quiz};
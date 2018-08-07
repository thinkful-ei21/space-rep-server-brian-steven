'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const NotecardSchema = mongoose.Schema({
	quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
	question: { type: String, required: true },
	answer: { type: String, required: true }
});

NotecardSchema.set('timestamps', true);

NotecardSchema.set('toObject', {
	virtuals: true,
	versionKey: false,
	transform: (doc, ret) => {
		delete ret._id;
	}
});

const Notecard = mongoose.model('Notecard', NotecardSchema);
module.exports = {Notecard};
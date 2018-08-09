'use strict';

const mongoose = require('mongoose');
 
mongoose.Promise = global.Promise;

const QuestionsListSchema = mongoose.Schema({
	value: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
	next: { type: mongoose.Schema.Types.ObjectId, ref: 'QuestionsList', default: null}
});

// QuestionsListSchema.methods.serialize = function() {
// 	let iter = QuestionsList.findById(this.questionsList);
// 	const str = [iter.value];
// 	while(iter.next !== null) {
// 		str.push({value: iter.value, next: iter.next});
// 		iter = QuestionsList.findById(iter.next);
// 	}
// 	return [...str];
// }

QuestionsListSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
  }
});

const QuestionsList = mongoose.model('QuestionsList', QuestionsListSchema);
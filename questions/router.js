'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const {Question} = require('./model');
const QuestionList = require('./list');

const router = express.Router();

const jsonParser = bodyParser.json();

// Post to register a new user
router.post('/', jsonParser, (req, res) => {
	const requiredFields = ['question', 'answer'];
	const missingField = requiredFields.find(field => !(field in req.body));
	if(missingField) {
		return res.status(422).json({
			code: 422,
			reason: 'ValidationError',
			message: 'Missing field',
			location: missingField
		});
	}

	let {question, answer} = req.body;
	question = question.trim();
	answer = answer.trim();

	return Question.create({question, answer})
		.then(question => res.status(201).json(question))
		.catch(err => {
			if (err.reason === 'ValidationError') {
				return res.status(err.code).json(err);
			}
			res.status(500).json({code: 500, message: 'Internal server error'});
		});
});

router.put('/:id', (req, res) => {
	// enter question's answer handling process here
	const {id} = req.params;
	const q = Question.findById(id);
	const bodyQuestion = req.body;

	//if question is right => LinkedList.findNextWithCorrect
	//if question is wrong => LinkedList.findNextWithIncorrect
});

router.get('/', (req, res) => {
	// @TODO: change this to return the next question in the LinkedList
	return Question.find()
		.then(questions => {
			console.log(questions);
			return res.json(questions);
		})
		.catch(err => res.status(500).json({message: 'Internal server error'}));
});

router.delete('/:id', (req, res) => {
	const {id} = req.params;

	Question.findByIdAndRemove(id)
		.then(() => {
			res.sendStatus(204);
		}).catch(err => {
			res.status(500).json({message: 'ID not found'});
		});
});

module.exports = {router};
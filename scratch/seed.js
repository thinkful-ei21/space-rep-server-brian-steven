'use strict';

const mongoose = require('mongoose');
const DATABASE_URL = 'mongodb://localhost/learn-spanish';

const User = require('../users/model');
const Question = require('../questions/model');

const seedUsers = require('../db/seed/users');
const seedQuestions = require('../db/seed/questions');

mongoose.connect(DATABASE_URL)
	.then(() => mongoose.connection.db.dropDatabase())
	.then(() => User.createMany(seedUsers)
	.then(() => Question.createMany(seedQuestions)
	.then(() => mongoose.disconnect())
	.catch(err => {
		console.log(err);
	});

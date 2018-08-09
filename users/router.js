'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const {User} = require('./model');
const {Question} = require('../questions/model');
const {QuestionsList} = require('../questions-list/model');

const router = express.Router();

const jsonParser = bodyParser.json();

// Post to register a new user
router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  const stringFields = ['username', 'password', 'firstName', 'lastName'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }
  
  const explicityTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

  const sizedFields = {
    username: {
      min: 1
    },
    password: {
      min: 5,
      // bcrypt truncates after 72 characters, so let's not give the illusion
      // of security by storing extra (unused) info
      max: 72
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      'min' in sizedFields[field] &&
            req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      'max' in sizedFields[field] &&
            req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField]
          .min} characters long`
        : `Must be at most ${sizedFields[tooLargeField]
          .max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  let {username, password, firstName = '', lastName = ''} = req.body;
  // Username and password come in pre-trimmed, otherwise we throw an error
  // before this
  firstName = firstName.trim();
  lastName = lastName.trim();

  return User.find({username})
    .count()
    .then(count => {
      if (count > 0) {
        // There is an existing user with the same username
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      // If there is no existing user, hash the password
      return User.hashPassword(password);
    })

    /*                                          (_id of next node)
  user: { question: { value: String, next: _id } }
    */
    .then(hash => {
      // console.log(`questions: ${questions}, hash: ${hash}`);
      // let lastId = null;
      // let head = QuestionsList.create({
      //   value: questions[0].id,
      //   next: null
      // });
      // let iter = head;
      // let index = 1;
      // let objs = questions.map(question => {
        // if(index < questions.length-1) {
          // TODO: How should these objects be structured?
          // How can I make the next point to the next node
          // return {
            // value: question.id
            // next: questions[index+1].id
          // };
        // } else {
        //   return {
        //     value: questions[index].id,
        //     next: null
        //   };
        // }
      // });
      // console.log(objs);
      // return QuestionsList.insertMany(objs);
    // })
    // .then(res => {
    //   console.log(res);
    //   return QuestionsList.find();
    // })
    // .then(res => {
    //   console.log(`response: ${res}, username:${username}`);
      return Promise.all(
        User.create({ username, password: hash, firstName, lastName })
    })
      // console.log(`head: ${head}`);
      // while(index < questions.length) {
      //   const node = QuestionsList.create({
      //     value: questions[index],
      //     next: null
      //   });
      //   iter.next = node.id;
      //   iter = iter.next;
      //   index++;
      // }
      // questions.map((question, index) => {

      //     QuestionsList.create({
      //       value: index,
      //       next: null
      //     })
      //     .then(questionItem => {
      //       if(lastId !== null) {
      //         const temp = lastId;
      //         lastId = questionItem.id;
      //         QuestionsList.findByIdAndUpdate(temp, {
      //           next: lastId
      //         });
      //       }
      //       // iter++;
      //       // index.push(questionItem.id);
      //     })
      
    // })
    .then(user => {
      let obj = user.serialize();
      obj.questionsList = QuestionsList.findById(user.questionsList)
      return res.status(201).json(user.serialize());
    })
    .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'});
    });
});

// Never expose all your users like below in a prod application
// we're just doing this so we have a quick way to see
// if we're creating users. keep in mind, you can also
// verify this in the Mongo shell.
router.get('/', (req, res) => {
  return User.find()
    .then(users => res.json(users.map(user => user.serialize())))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

function serializeQuestions(questionListId) {
  return QuestionsList.findById(questionsListId)
    .then(item => {
      if(item.next !== null) {
        return Promise.all([
          Question.findById(item.value),
          serializeQuestions(item.next)
        ]);
      } else {
        return Question.findById(item.value)
      }
    })
    .catch(err => {
      return 'serialize question error';
    });
}

module.exports = {router};
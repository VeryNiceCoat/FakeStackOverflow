const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

const Question = require('../models/questions')
const Tag = require('../models/tags')
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find()
    res.send(questions)
    if (!questions) {
      return res.status(404).send('questionS not found')
    }
  } catch (error) {
    console.error(error)
  }
})

/**
 * Returns Newest Questions
 */
router.get('/getNewest', async (req, res) => {
  try {
    const questions = await Question.getAllQuestionsByNewest()
    res.status(200).send(questions)
  } catch (error) {
    console.error(error.message)
    res.status(500)
    throw new Error('getNewest Error')
  }
})

/**
 * Returns Active Questions (Most Recently Updated)
 */
router.get('/getActive', async (req, res) => {
  try {
    const questions = await Question.getAllQuestionsByActivity()
    res.status(200).send(questions)
  } catch (error) {
    console.error(error.message)
    res.status(500)
    throw new Error('Getting Active Questions Error, router')
  }
})

/**
 * Returns Unanswered Questions by Newest
 */
router.get('/getUnanswered', async (req, res) => {
  try {
    const questions = await Question.getNewestUnansweredQuestions()
    res.status(200).send(questions)
  } catch (error) {
    console.error(error.message)
    res.status(500)
    throw new Error('getUnanswered Router Error')
  }
})

/**
 * QID Route
 */
router.get('/:questionID', async (req, res) => {
  try {
    req.session.user_id = 123
    const questionID = req.params.questionID
    const question = await Question.findById(questionID)
      .populate('tags')
      .populate('answers')
    if (!question) {
      return res.status(404).send('question not found')
    }
    res.send(question)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('server Error questions/getID   ')
  }
})

/**
 * This should be where question sort should happen
 */
router.get('/questionSearch', async (req, res) => {
  try {
    const questions = await Question.find()
  } catch (error) {
    console.error(error)
  }
})

router.post('/', async (req, res) => {
  try {
    const newQuestion = new Question({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      asked_by: req.body.asked_by,
      ask_date_time: new Date()
    })

    await newQuestion.save()
    res.status(201).json(newQuestion)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('server error questions/post')
  }
})

router.put(`/:questionID`, async (req, res) => {
  try {
    const questionID = new mongoose.Types.ObjectId(req.params.questionID)
    const answerID = new mongoose.Types.ObjectId(req.body.answerID)

    const question = await Question.findById(questionID)
    if (!question) {
      return res.status(404).send('Question not found')
    }

    question.answers.push(answerID)
    const updatedQuestion = await question.save()
    res.status(200).json(updatedQuestion)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error on questions/put')
  }
})

router.put('/:questionID/views', async (req, res) => {
  try {
    const questionID = req.params.questionID
    const question = await Question.findById(questionID)
    if (!question) {
      return res.status(404).send('Question not found')
    }

    question.views += 1
    const updatedQuestion = await question.save()

    res.status(200).json(updatedQuestion)
  } catch (error) {
    res.status(500).send('Server error on questions view update')
  }
})

router.put('/:questionID/upVote', async (req, res) => {
  try {
    const questionID = req.params.questionID
    const question = await Question.findById(questionID)
    if (!question) {
      return res.status(404).send('Question not found')
    }

    question.votes += 1
    const updatedQuestion = await question.save()

    res.status(200).json(updatedQuestion)
  } catch (error) {
    res.status(500).send('Server error on questions view update')
  }
})

router.put('/:questionID/downVote', async (req, res) => {
  try {
    const questionID = req.params.questionID
    const question = await Question.findById(questionID)
    if (!question) {
      return res.status(404).send('Question not found')
    }

    question.votes -= 1
    const updatedQuestion = await question.save()

    res.status(200).json(updatedQuestion)
  } catch (error) {
    res.status(500).send('Server error on questions view update')
  }
})

router.delete('/:questionId', async (req, res) => {
  try {
    const questionId = req.params.questionId
    const question = await Question.findById(questionId)
    const sessionEmail = req.session.email
    const questionEmail = question.email
    if (sessionEmail !== questionEmail) {
      res
        .status(401)
        .send('Trying to delete a question you are not an author of')
      return
    }
  } catch (error) {
    res.status(400).send('Server Question Delete Error')
  }
})

/**
 * Adds a comment to a question, given question ID and comment ID in
 * http://localhost:8000/questions/etc
 */
router.put('/:questionID/addComment/:commentID', async (req, res) => {
  try {
    if (req.session.email === 'guest@guest.com') {
      res.status(500).send("Guests don't have rights")
    }
    const questionID = req.params.questionID
    const question = await Question.findById(questionID)
    if (!question) {
      res.status(404).send('Question not found')
      return
    }
    const commentID = req.params.commentID
    question.comments.push(commentID)
    await question.save()
    res.status(200).send('GREAT SUCCESS')
    return
  } catch (error) {
    res.status(500).send('Server Error With Getting Data')
  }
})

module.exports = router

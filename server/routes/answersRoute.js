const express = require('express')
const router = express.Router()
const session = require('express-session')

const Answer = require('../models/answers')
const Account = require('../models/user')
const Question = require('../models/questions')

router.get('/', async (req, res) => {
  try {
    const answers = await Answer.find()
    res.send(answers)
    if (!answers) {
      return res.status(404).send('questionS not found')
    }
  } catch (error) {
    console.error(error)
  }
})

router.post('/', async (req, res) => {
  try {
    console.log(req.session.name)
    const account = await Account.findById(req.session.uid)
    if (account.isGuest() === true) {
      res.status(403).send("You're a guest, can't submit answers")
      return
      // throw new Error("You're a guest, can't submit answers")
    }
    const newAnswer = new Answer({
      text: req.body.text,
      ans_by: req.session.name,
      ask_date_time: new Date(),
      username: req.session.name,
      userId: req.session.uid
    })
    const temp = await newAnswer.save()
    res.status(201).json(temp)
  } catch (error) {
    res.status(500).send(error.message || 'server error answers/post')
  }
})

router.put('/:answerID/downVote', async (req, res) => {
  try {
    const answerID = req.params.answerID
    const answer = await Answer.findById(answerID)
    if (!answer) {
      return res.status(404).send('Question not found')
    }
    const answe = await answer.downvote()
    // answer.votes -= 1
    // const updatedAnswer = await answer.save()

    res.status(200).json(answe)
  } catch (error) {
    res.status(500).send('Server error on questions view update')
  }
})

router.put('/:answerID/upVote', async (req, res) => {
  try {
    const answerID = req.params.answerID
    const answer = await Answer.findById(answerID)
    if (!answer) {
      return res.status(404).send('Question not found')
    }

    const answe = await answer.upvote()
    res.status(200).json(answe)
    // answer.votes += 1
    // const updatedAnswer = await answer.save()

    // res.status(200).json(updatedAnswer)
  } catch (error) {
    res.status(500).send('Server error on questions view update')
  }
})

/**
 * Adds a comment to a question, given question ID and comment ID in
 * http://localhost:8000/questions/etc
 */
router.put('/:answerID/addComment/:commentID', async (req, res) => {
  try {
    const account = await Account.findById(req.session.uid)
    if (account.isGuest() === true) {
      res.status(403).send("Guests don't have rights")
      return
    }

    const answerID = req.params.answerID
    const answer = await Answer.findById(answerID)
    if (!answer) {
      res.status(404).send('answer not found')
      return
    }
    const commentID = req.params.commentID
    answer.comments.push(commentID)
    const answers = await answer.save()
    res.status(200).send(answers)
    return
  } catch (error) {
    res.status(500).send('Server Error With Getting Data')
    return
  }
})

router.delete('/:answerId', async (req, res) => {})

module.exports = router

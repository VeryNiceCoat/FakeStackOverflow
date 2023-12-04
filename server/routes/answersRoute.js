const express = require('express')
const router = express.Router()

const Answer = require('../models/answers')

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
    // const tagIds = req.body.tags.map(id => mongoose.Types.ObjectId(id));
    const newAnswer = new Answer({
      text: req.body.text,
      ans_by: req.body.ans_by,
      ask_date_time: new Date()
    })

    await newAnswer.save()
    res.status(201).json(newAnswer)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('server error answers/post')
  }
})

router.put('/:answerID/downVote', async (req, res) => {
  try {
    const answerID = req.params.answerID
    const answer = await Answer.findById(answerID)
    if (!answer) {
      return res.status(404).send('Question not found')
    }

    answer.votes -= 1
    const updatedAnswer = await answer.save()

    res.status(200).json(updatedAnswer)
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

    answer.votes += 1
    const updatedAnswer = await answer.save()

    res.status(200).json(updatedAnswer)
  } catch (error) {
    res.status(500).send('Server error on questions view update')
  }
})

router.delete('/:answerId', async (req, res) => {})

router
module.exports = router

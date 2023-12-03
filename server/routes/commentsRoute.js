const express = require('express')
const router = express.Router()

const Comment = require('../models/comments')

router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find()

    res.send(comments)
  } catch (error) {
    res.status(500).send('error')
  }
})

router.delete('/:commentID', async (req, res) => {
  try {
    const commentID = req.params.commentID
    await Comment.deleteOne({ _id: commentID })
    res.status(200).send('Comment', commentID, ' deleted succesfully')
  } catch (error) {
    res.status(400).send('Comment ID does not exist')
  }
})

module.exports = router

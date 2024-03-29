const express = require('express')
const router = express.Router()

const Comment = require('../models/comments')
const Account = require('../models/user')
const session = require('express-session')
const auth = require('./auth')
const errorHandler = require('./errorHandler')

router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find().sort({createdAt: -1})

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

router.put('/:commentID/upVote', auth.verify, async (req, res) => {
  try {
    // if (req.session.email === "guest@guest.com") {
    //   res.status(500).send('Guests have no rights')
    //   return
    // }
    const commentID = req.params.commentID
    const comment = await Comment.findById(commentID)
    if (!comment) {
      return res.status(404).send('Question not found')
    }

    // comment.votes += 1
    const updatedComment = await comment.upVote();

    res.status(200).json(updatedComment)
  } catch (error) {
    // console.error(error);
    res.status(403).send("Error Upvoting Comment");
    // next(error)
    // console.log("Error Message", error.message);
    // res.status(error.status || 500).json(error);
  }
}, errorHandler)

router.put('/newComment/:text', async (req, res) => {
  try {
    const text = req.params.text
    const userID = req.session.uid
    // console.log(userID)
    const user = await Account.findById(userID)
    if (!user) {
      res.status(404).send('Account Not Found')
    }
    if (user.reputation === -2) {
      res.status(500).send("You're a guest, no privelegies for you")
    }
    if (user.reputation <= 0 && user.reputation !== -1) {
      res.status(500).send('Not Enough Reputation')
    }
    const comment = new Comment({
      text: text,
      by: user.email,
      username: user.name,
      userId: userID
    })

    const comm = await comment.save()
    res.status(200).json(comm)
  } catch (error) {
    // res.status(500).send(error.message);
    // res.status(401).send(error);
  }
})

module.exports = router

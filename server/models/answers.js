var mongoose = require('mongoose')
var Schema = mongoose.Schema
var Comment = require('./comments')
var Account = require('./user')

var AnswerSchema = new Schema({
  text: { type: String, required: true },
  ans_by: { type: String, required: true },
  ans_date_time: { type: Date, default: Date.now },
  votes: { type: Number, default: 0 },
  comments: { type: [Schema.Types.ObjectId], ref: 'Comment' },
  username: { type: String, default: 'Anon' },
  userId: { type: Schema.Types.ObjectId }
})
AnswerSchema.virtual('url').get(function () {
  return 'posts/answer/' + this._id
})

AnswerSchema.methods.deleteAllCommentsAndItself = async function () {
  try {
    for (const commentId in this.comments) {
      try {
        await Comment.findByIdAndDelete(commentId)
      } catch (error) {
        console.error(error)
        continue
      }
    }
    this.remove()
  } catch (error) {
    console.error(error)
  }
}
/**
 * const answer = find One
 * answer.removeComment
 * @param {*} answerId
 */
AnswerSchema.methods.removeComment = async function (commentId) {
  this.comments = this.comments.filter(id => !id.equals(commentId))
  await this.save()
}

/**
 * Call this when a quesiton is being deleted, it will delete all comments from the answer first
 * using a special method, and the parent function should handle removing the answer from its array
 */
AnswerSchema.methods.questionDelete = async function () {
  try {
    for (const temp in this.comments) {
      try {
        await Comment.findByIdAndDelete(temp)
      } catch (error) {
        continue
      }
    }
    await this.remove()
  } catch (error) {
    console.error(error)
  }
}

AnswerSchema.methods.upvote = async function () {
  try {
    this.votes += 1
    const account = await Account.findById(this.userId)
    if (account === null) {
      throw new Error('Account not found')
    }
    await account.upvote()
  } catch (error) {
    console.error(error)
  }
}

AnswerSchema.methods.downvote = async function () {
  try {
    this.votes += 1
    const account = await Account.findById(this.userId)
    if (account === null) {
      throw new Error('Account Not Found')
    }
    await account.downvote()
  } catch (error) {
    console.error(error)
  }
}

module.exports = mongoose.model('Answer', AnswerSchema)

// Answer Document Schema
var mongoose = require('mongoose')
var Schema = mongoose.Schema
var Comment = require('./comments')

var AnswerSchema = new Schema({
  text: { type: String, required: true },
  ans_by: { type: String, required: true },
  ans_date_time: { type: Date, default: Date.now },
  votes: { type: Number, default: 0 },
  comments: { type: [Schema.Types.ObjectId], ref: 'Comment' },
  username: { type: String, default: 'Anon' },
  userId: { type: Schema.Types.ObjectId }
})
//vitual
AnswerSchema.virtual('url').get(function () {
  return 'posts/answer/' + this._id
})

AnswerSchema.pre(
  'deleteOne',
  { document: true, query: false },
  async function (next) {
    const answer = this
    try {
      if (answer.comments && answer.comments.length > 0) {
        for (const commentId of answer.comments) {
          await Comment.deleteOne({ _id: commentId })
        }
      }
      next()
    } catch (error) {
      next(error)
    }
  }
)

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

    await this.remove();
  } catch (error) {
    console.error(error);
  }
}

module.exports = mongoose.model('Answer', AnswerSchema)

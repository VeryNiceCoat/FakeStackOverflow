var mongoose = require('mongoose')
var Schema = mongoose.Schema

var AnswerSchema = new Schema(
  {
    text: { type: String, required: true },
    ans_by: { type: String, required: true },
    ans_date_time: { type: Date, default: Date.now },
    votes: { type: Number, default: 0 },
    comments: { type: [Schema.Types.ObjectId], ref: 'Comment' },
    username: { type: String, default: 'Anon' },
    userId: { type: Schema.Types.ObjectId }
  },
  /**
   * Makes properties createdAt, updatedAt
   */
  { timestamps: true }
)
AnswerSchema.virtual('url').get(function () {
  return 'posts/answer/' + this._id
})

/**
 * Deletes all comments below it, then deletes itself
 * Comments are deleted without affecting anything else, so there will be dangling 
 *  references to comments, assuming that this answer isn't deleted
 */
AnswerSchema.methods.deleteAllCommentsAndItself = async function () {
  try {
    // Delete all children
    for (const childId of this.comments) {
      await Comment.findByIdAndDelete(childId).exec();
    }

    // Delete this document
    await this.deleteOne();
  } catch (error) {
    console.error('Error deleting document and its children:', error);
    throw error; // Rethrow or handle error as needed
  }
}


/**
 * Removes a comment ID reference from this answer comments array, pass in comment ID
 *  Does not delete the comment in question
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

/**
 * Calls Account.upvote() which doesn't update reputation of Admin and Guest, so stuff doesn't break
 * @returns this The updated answer with vote+1
 */
AnswerSchema.methods.upvote = async function () {
  try {
    const account = await Account.findById(this.userId)
    await account.upvote()
    this.votes += 1
    await this.save()
    return this
  } catch (error) {
    return this
  }
}

/**
 * Read upvote
 */
AnswerSchema.methods.downvote = async function () {
  try {
    const account = Account.findById(this.userId)
    await account.downvote()
    this.votes += -1
    await this.save()
    return this
  } catch (error) {
    console.error(error)
    return this
  }
}

module.exports = mongoose.model('Answer', AnswerSchema)

var Comment = require('./comments')
var Account = require('./user')

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var QuestionSchema = new Schema(
  {
    title: { type: String, maxLength: 100, required: true },
    summary: { type: String, maxLength: 140, required: true },
    text: { type: String, required: true },
    tags: { type: [Schema.Types.ObjectId], ref: 'Tag', required: true },
    asked_by: { type: String, default: 'Anonymous', required: true },
    ask_date_time: { type: Date, default: Date.now },
    answers: { type: [Schema.Types.ObjectId], ref: 'Answer' },
    views: { type: Number, default: 0 },
    votes: { type: Number, default: 0 },
    comments: { type: [Schema.Types.ObjectId], ref: 'Comment' },
    username: { type: String, default: 'Anonymous' },
    userId: { type: Schema.Types.ObjectId }
  },
  { timestamps: true }
)

QuestionSchema.virtual('url').get(function () {
  return 'posts/question/' + this._id
})

/**
 * const question = Question.findbyID()
 * question.removeAnswer(answerID)
 * Doesn't delete answer from database, must be done manually
 * @param {*} answerId
 */
QuestionSchema.methods.removeAnswer = async function (answerId) {
  this.answers = this.answers.filter(id => !id.equals(answerId))
  await this.save()
}

QuestionSchema.methods.upvote = async function () {
  try {
    const account = await Account.findById(this.userId)
    this.votes += 1
    await this.save()
    await account.upvote()
    return this
  } catch (error) {
    return this
  }
}

QuestionSchema.methods.downvote = async function () {
  try {
    const account = Account.findById(this.userId)
    this.votes += -1
    await this.save()
    await account.downvote()
    return this
  } catch (error) {
    console.error(error)
    return this
  }
}

/**
 * @param {*} answerId
 */
QuestionSchema.methods.removeComment = async function (commentId) {
  this.comments = this.comments.filter(id => !id.equals(commentId))
  await this.save()
}

QuestionSchema.methods.userAccountDelete = async function () {
  try {
    for (const answerID in this.answers) {
      try {
        const answer = await Answer.findById(answerID)
        await answer.deleteAllCommentsAndItself()
      } catch (error) {
        console.error(error)
        continue
      }
    }
    await this.deleteOne();
  } catch (error) {
    console.error(error)
  }
}

/**
 * Instance method to get tag objects for the tags in the tags array.
 * @returns An array of tag objects.
 */
QuestionSchema.methods.getTags = async function () {
  try {
    const tags = await Promise.all(this.tags.map(tagId => Tag.findById(tagId)))
    return tags.filter(tag => tag !== null)
  } catch (error) {
    console.error('Error fetching tags:', error)
    throw error
  }
}

QuestionSchema.statics.findByUserId = async function (userId) {
  return this.find({ userId: userId })
}

QuestionSchema.methods.updateItself = async function (
  title,
  summary,
  text,
  tags
) {
  try {
  } catch (error) {
    throw error
  }
}

/**
 * @returns Questions for Active, based on answer activity
 */
QuestionSchema.statics.getAllQuestionsByActivity = async function () {
  try {
    // Aggregating questions and answers
    const questions = await this.aggregate([
      {
        $lookup: {
          from: 'answers', // the collection name of the Answer model
          localField: 'answers',
          foreignField: '_id',
          as: 'answerDetails'
        }
      },
      {
        $project: {
          title: 1,
          summary: 1,
          text: 1,
          tags: 1,
          asked_by: 1,
          ask_date_time: 1,
          answers: 1,
          views: 1,
          votes: 1,
          comments: 1,
          username: 1,
          userId: 1,
          updatedAt: 1,
          latestAnswerDate: { $max: '$answerDetails.createdAt' }
        }
      },
      {
        $sort: {
          latestAnswerDate: -1,
          updatedAt: -1 // Fallback sort for questions without answers
        }
      }
    ])
    return questions
  } catch (error) {
    throw new Error('Error in QuestionSchema.statics.getAllQuestionsByActivity')
  }
}

/**
 * @returns Questions for Active, based on answer activity
 */
QuestionSchema.statics.getAllQuestionsByNewest = async function () {
  try {
    const questions = await this.find().sort({ createdAt: -1 })
    return questions
  } catch (error) {
    throw new Error('QuestionSchema.statics.getAllQuestionsByActivity')
  }
}

QuestionSchema.statics.getNewestUnansweredQuestions = async function () {
  try {
    const questions = await this.find({ answers: { $size: 0 } }).sort({
      updatedAt: -1
    })
    return questions
  } catch (error) {
    throw new Error('QuestionSchema.statics.getNewestUnansweredQuestions')
  }
}

module.exports = mongoose.model('Question', QuestionSchema)

var Answer = require('./answers')
var Comment = require('./comments')
var Tag = require('./tags')
var Account = require('./user')

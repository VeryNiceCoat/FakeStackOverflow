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

// QuestionSchema.methods.getAllAnswers = async function () {}

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
        await answer.questionDelete()
      } catch (error) {
        console.error(error)
        continue
      }
    }
    await this.remove()
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
    throw error;
  }
}

QuestionSchema.statics.getAllQuestionsByActivity = async function () {
  try {
    // Sorting by 'updatedAt' in descending order (most recently updated first)
    const questions = await this.find().sort({ updatedAt: -1 })
    return questions
  } catch (error) {
    console.error('Error fetching questions by activity:', error)
    throw error
  }
}

module.exports = mongoose.model('Question', QuestionSchema)

var Answer = require('./answers')
var Comment = require('./comments')
var Tag = require('./tags')

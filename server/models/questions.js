// Question Document Schema
var mongoose = require('mongoose')
var Schema = mongoose.Schema


var QuestionSchema = new Schema({
  title: { type: String, maxLength: 100, required: true },
  summary: { type: String, maxLength: 140, required: true },
  text: { type: String, required: true },
  tags: { type: [Schema.Types.ObjectId], ref: 'Tag', required: true }, //we use the model in tags.js
  asked_by: { type: String, default: 'Anonymous', required: true },
  ask_date_time: { type: Date, default: Date.now },
  answers: { type: [Schema.Types.ObjectId], ref: 'Answer' }, //we use the answer.js model
  views: { type: Number, default: 0 },
  votes: { type: Number, default: 0 },
  comments: { type: [Schema.Types.ObjectId], ref: 'Comment' },
  username: { type: String, default: 'Anonymous' },
  userId: { type: Schema.Types.ObjectId }
})

//virtual method described in uml. ex Question.url returns post/question/_id
QuestionSchema.virtual('url').get(function () {
  return 'posts/question/' + this._id
})

QuestionSchema.methods.getAllAnswers = async function () {
  
}

/**
 * const question = Question.findbyID()
 * question.removeAnswer(answerID)
 * Doesn't delete answer from database, must be done manually
 * @param {*} answerId
 */
QuestionSchema.methods.removeAnswer = async function (answerId) {
  // Remove the answerId from the answers array
  this.answers = this.answers.filter(id => !id.equals(answerId))
  // Save the updated document
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
    // this.answers
    // this.comments
    for (const answerID in this.answers)
    {
      try {
        const answer = await Answer.findById(answerID);
        await answer.questionDelete();
      } catch (error) {
        console.error(error);
        continue;
      }
    }
    await this.remove()
  } catch (error) {
    console.error(error)
  }
}

module.exports = mongoose.model('Question', QuestionSchema)

var Answer = require('./answers')
var Comment = require('./comments')
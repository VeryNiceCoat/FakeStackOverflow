var mongoose = require('mongoose')
var Schema = mongoose.Schema
var Question = require('./questions')

var TagSchema = new Schema({
  name: { type: String, required: true }
})
TagSchema.virtual('url').get(function () {
  return 'posts/tag/' + this._id
})

TagSchema.methods.checkIfAnyQuestionsHasThisTag = async function () {
  try {
    const count = await Question.countDocuments({ tags: this._id })

    if (count > 0) {
      return true
    } else {
      await this.remove()
      return false
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

module.exports = mongoose.model('Tag', TagSchema)

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var TagSchema = new Schema(
  {
    name: { type: String, required: true }
  },
  { timestamps: true }
)
TagSchema.virtual('url').get(function () {
  return 'posts/tag/' + this._id
})

/**
 * Checks if any questions has a reference to this Tag
 * If there are none, delete Tag from the database
 * @returns True: At least 1 Question Has a reference
 *  False: 0 Questions has a reference to this tag
 */
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

/**
 * Returns an array of Tags that are in the Users Account
 * @example Call using Tag.findIfUserHasAnyTags(userID), not an instance method, static
 * @param {Account ID} ._id of Account to find all ids
 * @returns [] empty array if no Questions are found with an account
 * [Tags] an array of tags if Questions are found
 */
TagSchema.statics.findIfUserHasAnyTags = async function (userID) {
  try {
    const questions = await Question.findByUserId(userID)
    if (questions.length === 0) {
      return []
    }
    let combinedTags = questions.reduce(
      (acc, question) => acc.concat(question.tags),
      []
    )
    let uniqueTagIds = [...new Set(combinedTags.map(tag => tag.toString()))]
    return uniqueTagIds
  } catch (error) {
    console.error('Error finding tags:', error)
    throw error
  }
}

module.exports = mongoose.model('Tag', TagSchema)
var Question = require('./questions')

// Tag Document Schema
var mongoose = require('mongoose')
var Schema = mongoose.Schema
var Question = require('./questions')
var Answer = require('./answers')
var Comments = require('./comments')

var User = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  reputation: { type: Number, default: 0 }
})

//virtual field
User.virtual('url').get(function () {
  return '/accounts/' + this._id
})

/**
 * Checks if the user is an admin or guest, returns null if it is
 * If it isn't updates the user reputation by adding 5
 * then it calls this.save() to update the database.
 * @return Updated User Account with new reputation value that was saved to the database, null if admin/guest
 */
User.methods.upvote = async function () {
  if (this.reputation !== -1 && this.reputation !== -2) {
    this.reputation += 5
    await this.save()
    return this
  }
  return null
}

/**
 * Checks if the user is an admin or guest, returns null if it is
 * If it isn't updates the user reputation by adding -10
 * then it calls this.save() to update the database.
 * @return Updated User Account with new reputation value that was saved to the database, null if admin/guest
 */
User.methods.downvote = async function () {
  try {
    if (this.reputation !== -1 && this.reputation !== -2) {
      this.reputation -= 10
      await this.save()
      return this
    }  
  } catch (error) {
    console.error(error);
    return undefined;
  }
  return null
}

/**
 * @returns True if guest, false if not
 */
User.methods.isGuest = function () {
  if (this.reputation === -2) {
    return true
  }
  return false
}

/**
 * @returns True if admin, false if not
 */
User.methods.isAdmin = function () {
  if (this.reputation === -1) {
    return true
  }
  return false
}

/**
 * Wipes all traces of it throughout the entire database
 * @returns 1 if succeeds, 0 if admin or guest, -1 if server error
 */
User.methods.wipeAllReferences = async function () {
  if (this.reputation === -1 || this.reputation === -2) {
    return 0
  }
  try {
    const questions = await Question.find({ userId: this._id }).exec()
    const answers = await Answer.find({ userId: this._id }).exec()
    const comments = await Comment.find({ userId: this._id }).exec()
    for (const question in questions) {
      try {
        await question.userAccountDelete()
      } catch (error) {
        console.error(error)
        continue
      }
    }
    for (const answer in answers) {
      try {
        await answer.deleteAllCommentsAndItself()
      } catch (error) {
        console.error(error)
        continue
      }
    }
  } catch (error) {
    console.error(error)
    return -1
  }
}

module.exports = mongoose.model('Account', User)

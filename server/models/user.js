// Tag Document Schema
var mongoose = require('mongoose')
var Schema = mongoose.Schema
var Question = require('./questions')
var Answer = require('./answers')
var Comment = require('./comments')

/**
 * name: account name
 * email: email
 * password: bcrypt with salt of 5, use comparePassword
 * reputation: Name, 50 is cutoff for access of normal users
 *  otherwise -1 is admin, to check call isAdmin
 *  and -2 is guest, call isGuest
 */
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
  // throw new Error('Account is either a guest or admin, cannot upvote')
  return null
}

/**
 * Checks if the user is an admin or guest, returns null if it is
 * If it isn't updates the user reputation by adding -10
 * then it calls this.save() to update the database.
 * @return Updated User Account with new reputation value that was saved to the database, null if admin/guest
 */
User.methods.downvote = async function () {
  if (!this.isRegularUser()) {
    return null
  } else {
    try {
      this.reputation -= 10
      await this.save()
      return this
    } catch (error) {
      console.error(error)
      return undefined
    }
  }
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
 * @returns True if account is a normal user
 */
User.methods.isRegularUser = function () {
  if (this.reputation !== -2 && this.reputation !== -1) {
    return true
  }
  return false
}

/**
 * Wipes all traces of it throughout the entire database
 * Goes through every question, anwer, and comment in databse using Schema.find()
 *  which is filtered by the id of the account which is contained in the userId
 *  property in each value
 * Since find returns an array, loops through them all in a for loop, try and
 *  catch statements in each loop for previously deleted quesitons, answers, or comments
 * Calls each value special delete method, so Question special delete will remove all
 *  comments and answers underneath that question, same for answers deleting each comment
 *  Comments don't need a special delete, but it might be defined anyway
 * @returns 1 if succeeds, 0 if admin or guest, -1 if server error
 */
User.methods.wipeAllReferences = async function () {
  if (!this.isRegularUser()) {
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
    for (const comment in comments) {
      try {
        await Comment.findByIdAndDelete(comment._id)
      } catch (error) {
        console.error(error)
      }
    }
    return 1
  } catch (error) {
    console.error(error)
    return -1
  }
}

/**
 * Wrapper for find({userId: this._id})
 */
User.methods.returnAllQuestions = async function () {
  try {
    const questions = await Question.find({ userId: this._id })
    return questions
  } catch (error) {
    throw error
  }
}
/**
 * Wrapper for find({userId: this._id})
 */
User.methods.returnAllAnswers = async function () {
  try {
    const answers = await Answer.find({ userId: this._id })
    return answers
  } catch (error) {
    throw error
  }
}

/**
 * Wrapper for find({userId: this._id})
 */
User.methods.returnAllComments = async function () {
  try {
    const comments = await Comment.find({ userId: this._id })
    return comments
  } catch (error) {
    throw error
  }
}

module.exports = mongoose.model('Account', User)

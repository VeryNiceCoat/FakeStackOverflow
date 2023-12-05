// Tag Document Schema
var mongoose = require('mongoose')
var Schema = mongoose.Schema
var Question = require('./questions')

var User = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  reputation: { type: Number, default: 0 },
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
User.methods.upvote = async function() {
  if (this.reputation !== -1 && this.reputation !== -2) {
    this.reputation += 5;
    await this.save(); 
    return this; 
  }
  return null;
};

/**
 * @returns True if guest, false if not
 */
User.methods.isGuest = function () {
  if (this.reputation === -2)
  {
    return true;
  }
  return false;
}

/**
 * @returns True if admin, false if not
 */
User.methods.isAdmin = function () {
  if (this.reputation === -1) {
    return true;
  }
  return false;
}


module.exports = mongoose.model('Account', User)

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

module.exports = mongoose.model('Account', User)

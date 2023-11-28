// Tag Document Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema ({
    name: {type: String, required: true},
    password: {type: String, required: true}
})

//virtual field
User.virtual('url').get(function() {
    return 'posts/tag/' + this._id;
})

module.exports = mongoose.model('Account', User);
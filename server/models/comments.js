var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    text: {type: String, required: true},
    by: {type: String, required: true},
    date_time: {type: Date, default: Date.now},
    votes: {type: Number, default: 0},
    username: {type: String, default:'Anon'},
    userId: {type: Schema.Types.ObjectId}
});

CommentSchema.virtual('url').get(function() {
    return 'posts/comments' + this._id;
});

module.exports = mongoose.model('Comment', CommentSchema);
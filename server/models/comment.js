// Answer Document Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var CommentSchema = new Schema({
    text: {type: String, required: true},
})
var AnswerSchema = new Schema({
    text: {type: String, required: true},
    ans_by: {type: String, required: true},
    ans_date_time: {type: Date, default: Date.now}
});
//vitual
CommentSchema.virtual('url').get(function() {
    return 'posts/answers/comments' + this._id;
})
module.exports = mongoose.model('Comment', CommentSchema);
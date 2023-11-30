// Question Document Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionSchema = new Schema({
    title: {type: String, maxLength: 100, required: true,},
    summary: {type: String, maxLength: 140, required: true},
    text: {type: String, required: true},
    tags: {type: [Schema.Types.ObjectId], ref: 'Tag', required: true}, //we use the model in tags.js
    asked_by: {type: String, default: 'Anonymous', required: true},
    ask_date_time: {type: Date, default: Date.now},
    answers: {type: [Schema.Types.ObjectId], ref: 'Answer'}, //we use the answer.js model
    views: {type: Number, default: 0},
    votes: {type: Number, default: 0},
    comments: {type: [Schema.Types.ObjectId], ref: 'Comment'},
    username: {type: String, default: 'Anonymous'}
})
//virtual method described in uml. ex Question.url returns post/question/_id
QuestionSchema.virtual('url').get(function() {
    return 'posts/question/' + this._id;
});

module.exports = mongoose.model('Question', QuestionSchema);
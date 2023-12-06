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

/**
 * Handles Comment Upvote
 * @returns 
 */
CommentSchema.methods.upVote = async function () {
    try {
        this.votes += 1;
        // await this.save();
        const account = await Account.findById(userId);
        if (!account) {
            throw new Error('Account of Comment Does not exist')
        }
        await account.upvote;
        return await this.save();
    } catch (error) {
        throw error;
    }
}


module.exports = mongoose.model('Comment', CommentSchema);

var Account = require('./user')

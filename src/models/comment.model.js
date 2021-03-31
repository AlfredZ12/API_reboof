const { Schema, model } = require('mongoose');

const CommentSchema = new Schema({
    bodyComment: { type: String, require: true },

    author: { type: Schema.Types.ObjectId, required: true ,ref: 'User',autopopulate: true},
    
    likes: [
        {
            user_id: { type: Schema.Types.ObjectId, ref: 'User' }
        }
    ]


}, { timestamps: true });

module.exports = model('Comment', CommentSchema);
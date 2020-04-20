const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    commentor : {
        type: mongoose.Schema({
            userId : {
                type: String,
                required : true
            },
            name : {
                type : String,
                required : true
            }
        }),
        required : true
    },
    issueId : {
        type : String,
        required : true
    },
    comment : {
        type : String,
        required : true
    },
    createdOn : {
        type : Date,
        required : true
    }
});

const Comment = mongoose.model('comment',commentSchema);

module.exports.Comment = Comment;
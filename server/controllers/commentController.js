const {Comment} = require('../models/comment');
const { User } = require('../models/user');
const { generateResponse } = require('../libs/responseLib');
const winstonLogger = require('../libs/winstonLib');

const isEmpty = require('../libs/checkLib');

async function addComment(req,res){
    
    const user = await User.findOne({userId : req.body.userId}).select("name");
    
    if(isEmpty(user)){
        winstonLogger.error("user not found")
        return res.send(generateResponse(404,true,"User not Found",null));
    }
    
        let comment = new Comment({
            commentor : {
                userId : req.body.userId,
                name : user.name
            },
            issueId : req.body.issueId,
            comment : req.body.comment,
            createdOn : req.body.createdOn
        });

        comment = await comment.save();
        winstonLogger.info("Comment added Successfully");
        comment.toObject();
        return res.send(generateResponse(200,null,"Comment Added Successfully",comment));
    
}

async function getComment(req,res){
    const comments = await Comment.find({issueId : req.params.issueId}).select('-_id-__v')
                        .sort({createdOn : -1});

    if(isEmpty(comments)){
        
        return res.send(generateResponse(404,true,"Comment not available for given issue",null));
    }
    
    return res.send(generateResponse(200,null,"Got Comments",comments));
}


module.exports.addComment = addComment;
module.exports.getComment = getComment;
const { generateResponse } = require('../libs/responseLib');
const { Issue } = require('../models/issue');
const { User }  = require('../models/user');
const isEmpty = require('../libs/checkLib');
const winLogger = require('../libs/winstonLib');


async function reportIssue(req,res){

    const assign = await User.findOne({userId : req.body.assignedTo}).select('userId name');
    
    const report = await User.findOne({userId : req.body.reporter}).select('userId name');
    
    nattachments = [];

    let issue = new Issue({
        issueId : req.body.issueId,
        reporter : {
            userId : report.userId,
            name : report.name
        },
        status : req.body.status,
        seen : req.body.seen,
        createdOn : req.body.createdOn,
        assignedTo : {
            userId : assign.userId,
            name : assign.name
        },
        description : req.body.description,
        title : req.body.title,
        attachments : nattachments,
        watchers : [assign,report]
    });

    issue = await issue.save();
    winLogger.info("Issue Created : "+issue.issueId);
    issue.toObject();
    
    return res.send(generateResponse(200,null,"Issue Reported Successfully",issue));
  
}

async function getAllIssues(req,res){
    let issues = await Issue.find().select('-__v-_id');

    if(isEmpty(issues)){
        return res.send(generateResponse(404,true,"No Issues Reported yet",null));
    }else{
        // issues = issues.toObject();
        return res.send(generateResponse(200,null,"Issues Found",issues));
    }
}

async function getMyIssues(req,res){
    const issues = await Issue.find({"assignedTo.userId" : req.params.userId});

    if(isEmpty(issues)){
        return res.send(generateResponse(404,true,"No Issues Assigned Yet",null));
    }else{
        return res.send(generateResponse(200,null,"Issues Found",issues));
    }
}

async function getIssue(req,res){
    
    const issue = await Issue.findOne({issueId : req.params.issueId}).select("-_id-__v");
    
    if(isEmpty(issue)){
        return res.send(generateResponse(404,true,"No issue with provided is found",null));
    }else{
        return res.send(generateResponse(200,null,"Issue Found",issue));
    }
}

async function updateIssue(req,res){
    const user = await User.findOne({userId : req.body.assignedTo.userId}).select("-_id-__v");
    
    if(isEmpty(user)){
        winLogger.error("User not Found");
        return res.send(generateResponse(404,true,"Assigneee not found",null));
    }
    let issue = await Issue.findOne({issueId : req.params.issueId}).select("-_id-__v");
    if(isEmpty(issue)){
        winLogger.error("Issue not Found");
        return res.send(generateResponse(404,true,"Issue not found",null));
    }
    issue.description = req.body.description;
    issue.status = req.body.status;
    issue.assignedTo = {
        userId : user.userId,
        name : user.name
    }
    let alreadyPresent = false;
    for(let watcher of issue.watchers){
        if(user.userId == watcher.userId){
            alreadyPresent = true;
            break;
        }
    }
    
    if(!alreadyPresent){
        issue.watchers.push(user);
    }
    
    
    issue = await issue.save();
    winLogger.info("Issue Updated Successfully");
    issue.toObject();
    return res.send(generateResponse(200,null,"Updated",issue));
}

async function searchIssue(req,res){
    const issues = await Issue.find({ title : {$regex: req.params.title}}).select("-_id-__v");

    if(isEmpty(issues)){
        winLogger.info("Issues Not Found");
        return res.send(generateResponse(404,true,"No Issues Found",null));
    }else{
        winLogger.info("Issues Found");
        return res.send(generateResponse(200,null,"Issues Found",issues));
    }
}

async function addWatcher(req,res){
    const user = await User.findOne({userId : req.body.userId}).select("userId name");

    if(isEmpty(user)){
        winLogger.error("User not Found");
        return res.send(generateResponse(404,true,"User not Found",null));
    }else{
        let issue = await Issue.findOneAndUpdate({issueId : req.params.issueId},
            {$push : { watchers : user }},
            {new : true}
            );
            issue.toObject();
        winLogger.info("Watcher Added");
        return res.send(generateResponse(200,null,"Added Watcher",issue));
    }
}

async function removeWatcher(req,res){
    const user = await User.findOne({userId : req.body.userId}).select("userId name"); 
    if(isEmpty(user)){
        winLogger.error("User Not Found");
        return res.send(generateResponse(404,true,"User not found",req.body.userId));
    }
    let issue = await Issue.findOneAndUpdate({issueId : req.params.issueId},
        {
            $pull : { watchers : {userId : user.userId,name : user.name } }
        },
        {new: true}
        );
    winLogger.info("WAtcher Removed");
    issue.toObject();
    return res.send(generateResponse(200,null,"Removed Watcher",issue));

}

module.exports.reportIssue = reportIssue;
module.exports.getAllIssues = getAllIssues;
module.exports.getMyIssues = getMyIssues;
module.exports.getIssue = getIssue; 
module.exports.updateIssue = updateIssue;
module.exports.searchIssue = searchIssue;
module.exports.addWatcher = addWatcher;
module.exports.removeWatcher = removeWatcher;
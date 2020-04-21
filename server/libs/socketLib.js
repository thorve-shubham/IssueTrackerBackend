const socket = require('socket.io');
const { Issue } = require('../models/issue');
const isEmpty = require('../libs/checkLib');



module.exports =function(app){
    const MainSocket = socket.listen(app).of('issueTracker');
     
    MainSocket.on("connection",(user)=>{
        console.log("someone connected");

        user.on("attachment",(issueId)=>{
            
            Issue.findOne({issueId : issueId},(err,data)=>{
                for(let watcher of data.watchers){
                    MainSocket.emit(watcher.userId,{issueId : issueId,issueTitle : data.title,message : "Attachments got Modified"});
                }
            }).select("watchers title");
        });

        user.on("issueModified",(issueId)=>{
            Issue.findOne({issueId : issueId},(err,data)=>{
                for(let watcher of data.watchers){
                    MainSocket.emit(watcher.userId,{issueId : issueId,issueTitle : data.title,message : "Details got Modified"});
                }
            }).select("watchers title");
        });

        user.on("watchersModified",(issueId)=>{
            Issue.findOne({issueId : issueId},(err,data)=>{
                for(let watcher of data.watchers){
                    MainSocket.emit(watcher.userId,{issueId : issueId,issueTitle : data.title,message : "Watchers got Modified"});
                }
            }).select("watchers title");
        });

        user.on("commentModified",(info)=>{
            Issue.findOne({issueId : info.issueId},(err,data)=>{
                for(let watcher of data.watchers){
                    MainSocket.emit(watcher.userId,{issueId : info.issueId,issueTitle : data.title,message : info.userName+" Added Comments"});
                }
            }).select("watchers title");
        })

        user.on("disconnect",()=>{
            console.log("disconnected");
        });

    });

    
}
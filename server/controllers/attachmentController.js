const { Issue }  = require('../models/issue');
const isEmpty = require('../libs/checkLib');
const { generateResponse } = require('../libs/responseLib');
const winstonLogger = require('../libs/winstonLib');
const fs = require('fs');
const path = require('path');
const config = require('config');
const aws = require('aws-sdk');
const s3 = new aws.S3({
    accessKeyId: process.env.API_KEY,
    secretAccessKey: process.env.API_SECRET
});

async function addAttachment(req,res){
    let filenames = [];
    for(let x of req.files){
        filenames.push(x.filename);
    }
    
    let length = req.files.length;
    let iteration = 0;   
    for(let file of req.files){
        const file1 = fs.readFileSync(path.resolve('./server/attachments')+"/"+file.filename);

        const params = {
            Bucket : process.env.BUCKET_NAME,
            Key : file.filename,
            Body : file1
        }
        iteration++;
        s3.upload(params,(err,data)=>{
            if(err){
                winstonLogger.error("Uploading failed at aws level");
                return res.send(generateResponse(403,true,"Error in Uploading : "+err,null));
            } else{
                fs.unlinkSync(path.resolve("./server/attachments")+"/"+file.filename);
                Issue.findOneAndUpdate({issueId : req.params.issueId},
                    { $push : { attachments :file.filename}},{new : true},
                    (err,issue)=>{
                        if(err){
                            winstonLogger.error("Error in file uploading in database");
                            return res.send(generateResponse(403,true,"Error in Uploading",null));
                        }
                        if(length==iteration){
                            winstonLogger.info("Files got Uploaded");
                            return res.send(generateResponse(200,null,"Attachments Added Successfully",issue.attachments));
                        }
                    }
                );
                
            }  
        });
    }
    
}

async function deleteAttachment(req,res){
    // fs.unlinkSync(path.resolve('./server/attachments')+'/'+req.body.filename);

    const params = {
        Bucket : process.env.BUCKET_NAME,
        Key : req.body.filename
    }

    s3.deleteObject(params,(err,data)=>{
        if(err){
            winstonLogger.error("File Deletion failed aws level");
            return res.send(generateResponse(403,true,"failed to delete",null));
        }else{
            Issue.findOneAndUpdate({issueId: req.params.issueId},
                {$pull : { attachments : req.body.filename}},
                {new : true},
                (err,issue)=>{
                    if(err){
                        winstonLogger.error("File deletion failed at database level");
                    }else{
                        winstonLogger.info("File Deletion successful");
                        issue.toObject();
                        return res.send(generateResponse(200,null,"deleted Attachment",issue.attachments));
                    }
                    
                }
            );
        }
    });

}

async function downloadAttachement(req,res){

    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: req.params.filename
      }
     
      res.setHeader('Content-Disposition', 'attachment');
     
      s3.getObject(params)
        .createReadStream()
          .on('error', function(err){
            res.status(500).json({error:"Error -> " + err});
        }).pipe(res);

    
}

module.exports.addAttachment = addAttachment;
module.exports.deleteAttachment = deleteAttachment;
module.exports.downloadAttachement = downloadAttachement;
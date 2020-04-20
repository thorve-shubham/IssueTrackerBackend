const { Issue }  = require('../models/issue');
const isEmpty = require('../libs/checkLib');
const { generateResponse } = require('../libs/responseLib');
const winstonLogger = require('../libs/winstonLib');
const fs = require('fs');
const path = require('path');
const config = require('config');
const aws = require('aws-sdk');
const s3 = new aws.S3({
    accessKeyId: config.get("accessKey"),
    secretAccessKey: config.get("secret")
});

async function addAttachment(req,res){
    let filenames = [];
    for(let x of req.files){
        filenames.push(x.filename);
    }
    console.log(req.files);
       
    for(let file of req.files){
        const file1 = fs.readFileSync(path.resolve('./server/attachments')+"/"+file.filename);

        const params = {
            Bucket : config.get("bucket_name"),
            Key : file.filename,
            Body : file1
        }

        s3.upload(params,(err,data)=>{
            if(err) console.log(err);
            console.log("uploaded");
            fs.unlinkSync(path.resolve("./server/attachments")+"/"+file.filename);
        })
    }

    const issue = await Issue.findOneAndUpdate({issueId : req.params.issueId},
        { $push : { attachments : {$each : filenames}}},{new : true});

    return res.send(generateResponse(200,null,"Attachments Added Successfully",issue.attachments));
    
    
}

async function deleteAttachment(req,res){
    // fs.unlinkSync(path.resolve('./server/attachments')+'/'+req.body.filename);

    const params = {
        Bucket : config.get("bucket_name"),
        Key : req.body.filename
    }

    s3.deleteObject(params,(err,data)=>{
        if(err){
            console.log("failed : "+err);
        }else{
            console.log("deleted");
           
        }
    });

    let issue  = await Issue.findOneAndUpdate({issueId: req.params.issueId},
        {$pull : { attachments : req.body.filename}},
        {new : true}
        );

    issue.toObject();
    return res.send(generateResponse(200,null,"deleted Attachment",issue.attachments));

}

async function downloadAttachement(req,res){

    const params = {
        Bucket: config.get("bucket_name"),
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
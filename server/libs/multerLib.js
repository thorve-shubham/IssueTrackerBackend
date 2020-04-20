
const multer = require('multer');
const path = require('path');
const shortId = require('shortid');

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,path.resolve("./server/attachments"));
  },
  filename: (req, file, cb) => {
    cb(null, shortId.generate()+"_"+Date.now()+file.originalname);
  }
});
 
var upload = multer({storage: storage});
 
module.exports = upload;
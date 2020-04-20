const express = require('express');
const router = express.Router();
const upload = require("../libs/multerLib");
const auth = require('../middleware/auth');


const attachmentController = require('../controllers/attachmentController');

router.post("/create/:issueId",auth,upload.array('file'),attachmentController.addAttachment);

router.put("/delete/:issueId",auth,attachmentController.deleteAttachment);

router.get("/download/:filename",auth,attachmentController.downloadAttachement);

module.exports = router;
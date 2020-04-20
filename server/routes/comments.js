const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const commentController = require('../controllers/commentController');

router.post("/add",auth,commentController.addComment);

router.get("/get/:issueId",auth,commentController.getComment)


module.exports = router;
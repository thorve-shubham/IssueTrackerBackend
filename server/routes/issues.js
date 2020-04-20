const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const issueController = require('../controllers/issueController');

router.post("/create",auth,issueController.reportIssue);

router.get("/get",auth,issueController.getAllIssues);

router.get("/get/assignedTo/:userId",auth,issueController.getMyIssues);

router.get("/get/issue/:issueId",auth,issueController.getIssue);

router.put("/update/:issueId",auth,issueController.updateIssue);

router.get("/search/:title",auth,issueController.searchIssue);

router.post("/addWatcher/:issueId",auth,issueController.addWatcher);

router.post("/removeWatcher/:issueId",auth,issueController.removeWatcher);

module.exports = router;
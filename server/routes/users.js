const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

const userController = require('../controllers/userController');

router.post("/create",userController.createUser);

router.post("/login",userController.login);

router.get("/get",auth,userController.getAllUsers)

module.exports = router;
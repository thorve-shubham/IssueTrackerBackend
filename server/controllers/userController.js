const { User } = require('../models/user');
const bcryptLib = require('../libs/bcryptLib');
const { generateResponse } = require('../libs/responseLib');
const isEmpty = require('../libs/checkLib');
const winLogger = require('../libs/winstonLib');

async function createUser(req,res){

    const olduser = await User.find({email:req.body.email}).select('-_id-__v');
    
    if(!isEmpty(olduser)){
        winLogger.info("User already Exists");
        return res.send(generateResponse(403,true,"User Already Exists",null));
    }

    req.body.password = await bcryptLib.generateHashedPassword(req.body.password);

    const user = new User({
        userId : req.body.userId,
        name : req.body.name,
        email : req.body.email,
        password : req.body.password
    });


    await user.save();

    winLogger.info("User created Successfully");

    return res.send(generateResponse(200,null,"User Created Successfully",user));
}

async function login(req,res){
    
    const user = await User.findOne({email:req.body.email}).select('-_id-__v');
    if(isEmpty(user)){
        winLogger.info("User not FOund");
        return res.send(generateResponse(403,true,"Invalid Email or Password",null));
    }
    if(await bcryptLib.isPasswordRight(req.body.password,user.password)){
        const token = user.generateAuthToken();
        winLogger.info("User Logged In Successfully : "+ user.userId);
        return res.header('x-authToken',token).send(generateResponse(200,null,"Login Successful",token));
    }
    
    return res.send(generateResponse(403,true,"Invalid Email or Password",null));
    

}

async function getAllUsers(req,res){
    const users = await User.find().select("-_id name userId");

    if(isEmpty(users)){
        winLogger.info("No Users at all");
        return res.send(generateResponse(404,true,"No users",null));
    }
    else{
        winLogger.info("Got all users");
        return res.send(generateResponse(200,null,"All users",users));
    }
}

module.exports.createUser = createUser;
module.exports.login = login;
module.exports.getAllUsers = getAllUsers;
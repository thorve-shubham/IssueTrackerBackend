const isEmpty = require('../libs/checkLib');
const { generateResponse } = require('../libs/responseLib');
const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req,res,next)=>{
    if(isEmpty(req.query.authToken)){
        console.log('empty');
        console.log(req.query.authToken);
        return res.send(generateResponse(404,true,"Auth Token Missing",null));
    }else{
        try{
            const token = jwt.verify(req.query.authToken,config.get("jwtKey"));
            console.log('valid');
            next();
        }catch(err){
            console.log('invalid');
            return res.send(generateResponse(403,true,"Invalid Token Provided",null));
        }
    }
}
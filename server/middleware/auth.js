const isEmpty = require('../libs/checkLib');
const { generateResponse } = require('../libs/responseLib');
const jwt = require('jsonwebtoken');
const config = require('config');
const winLogger = require("../libs/winstonLib");

module.exports = (req,res,next)=>{
    if(isEmpty(req.query.authToken)){
        winLogger.error("No Token Provided");
        return res.send(generateResponse(404,true,"Auth Token Missing",null));
    }else{
        try{
            const token = jwt.verify(req.query.authToken,config.get("jwtKey"));
            winLogger.info("Valid Token Provided");
            next();
        }catch(err){
            winLogger.error("Invalid/ Expired Token Provided");
            console.log('invalid');
            return res.send(generateResponse(403,true,"Invalid Token Provided",null));
        }
    }
}
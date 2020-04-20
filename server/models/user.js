const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = mongoose.Schema({
    userId :{
        type : String,
        required : true
    },
    name : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    }
});

userSchema.methods.generateAuthToken = function(){
    const info = {
        exp : Math.floor(Date.now() / 1000) + (60 * 60 * 24),  //1day
        Data : {
            userId : this.userId,
            name : this.name,
            email : this.email
        }
    }
    return jwt.sign(info,config.get("jwtKey"));
}

const User = mongoose.model("user",userSchema);

module.exports.User = User;
module.exports.userSchema = userSchema;
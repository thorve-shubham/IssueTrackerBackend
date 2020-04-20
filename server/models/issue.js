const mongoose = require('mongoose');


const issueSchema = mongoose.Schema({
    issueId :{
        type : String,
        required : true
    },
    title:{
        type : String,
        required : true
    },
    description : {
        type: String,
        required : true
    },
    assignedTo : {
        type : new mongoose.Schema({
            userId : {
                type : String,
                required : true
            },
            name : {
                type : String,
                required : true
            }
        }),
        required : true
    },
    reporter : {
        type : new mongoose.Schema({
            userId : {
                type : String,
                required : true
            },
            name : {
                type : String,
                required : true
            }
        }),
        required : true
    },
    status : {
        type : String,
        required : true,
        enum : ["In Progress","Back-Log","Done"]
    },
    attachments : {
        type : [String],
    },
    seen : {
        type : Boolean,
        default : false
    },
    createdOn : {
        type : Date,
        required : true
    },
    watchers : {
        type : [new mongoose.Schema({
            userId: {
                type: String,
                required : true
            },
            name : {
                type :String,
                required : true
            }
        })]
    }
});

const Issue = mongoose.model("issue",issueSchema);

module.exports.Issue = Issue;
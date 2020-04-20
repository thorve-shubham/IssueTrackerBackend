function generateResponse(status,err,msg,data){
    return {
        status : status,
        error : err,
        message : msg,
        data : data
    }
}

module.exports.generateResponse = generateResponse;
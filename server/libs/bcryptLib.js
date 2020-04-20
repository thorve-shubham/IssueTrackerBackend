const bcrypt = require('bcrypt');

async function generateHashedPassword(pass){
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(pass,salt);
}

async function isPasswordRight(toCheck,hash){
    const valid = await bcrypt.compare(toCheck,hash);
    if(!valid) return false;
    return true;
}

module.exports.generateHashedPassword = generateHashedPassword;
module.exports.isPasswordRight = isPasswordRight;
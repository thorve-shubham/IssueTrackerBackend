const bcrypt = require('bcrypt');
const salt =  bcrypt.genSaltSync(10);

async function generateHashedPassword(pass){
    return await bcrypt.hash(pass,salt);
}

async function isPasswordRight(toCheck,hash){
    const valid = await bcrypt.compare(toCheck,hash);
    return valid;
}

module.exports.generateHashedPassword = generateHashedPassword;
module.exports.isPasswordRight = isPasswordRight;
const userModel = require("../components/modals/usermodal");
const bcrypt = require("bcryptjs");


const CheckExistingUser = async (name) => {
    let existingUser = false;
    const userData = await userModel.find({ $or: [{ email: name }, { phone: name }] })
    if (userData.length) {
        existingUser = true;
        }
    return existingUser;
}

const generatePasswordHash = async(password) => {
    const salt = 10;
    const hashSalt = await bcrypt.genSalt(salt);
    const hashedPassword = await bcrypt.hash(password, hashSalt);

    return hashedPassword;   
}

module.exports = {CheckExistingUser,generatePasswordHash}
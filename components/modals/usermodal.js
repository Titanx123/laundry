const  mongoose = require( "mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        minLength: 10,
        maxLength: 10
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    address: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
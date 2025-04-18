const validator = require('validator');
const User = require('../models/userSchema');

const validateSignUp = (req) => {
    const {firstName, lastName, email, password} = req.body;

    if(!firstName || !lastName){
        throw new Error("Enter a Valid Name");
    }
    else if(!validator.isEmail(email)){
        throw new Error("Enter a Valid Email");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please Enter a Strong Password..")
    }
}

const validateUserData = (req) => {
    const allowEditKeys = ["firstName", "lastName", "age", "photoUrl", "about", "skill"];

    return Object.keys(req.body).every( keys => allowEditKeys.includes(keys));
}

module.exports = { 
    validateSignUp, 
    validateUserData, };
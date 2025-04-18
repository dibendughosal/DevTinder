const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required:true,
        lowercase:true,
        unique: true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Please enter a valid email..")
            }
        }
    },
    password:{
        type: String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a Strong Password");
            }
        }
    },
    age: {
        type: Number
    },
    photoUrl: {
        type: String,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Enter a valid URL")
            }
        }
    },
    about: {
        type:String
    },
    skill: {type: String}
}, {timestamps: true})

userSchema.methods.getJWT = async function(){
    const user = this;
    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: "1d"});

    return token;
}
userSchema.methods.validatePassword = async function(passwordByUser){
    const user = this;
    const isPasswordValid = await bcrypt.compare(passwordByUser, user.password);

    return isPasswordValid;
}
userSchema.index({ firstName: 1, lastName: 1});

const User = mongoose.model("user", userSchema);
module.exports = User;
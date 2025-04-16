const mongoose = require('mongoose');
const validator = require('validator');

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

const User = mongoose.model("user", userSchema);
module.exports = User;
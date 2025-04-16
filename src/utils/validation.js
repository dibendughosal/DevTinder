const validator = require('validator');

const validateSignUp = (req) => {
    const {firstName, lastName, email, password} = req.body;

    if(!firstName){
        throw new Error("Enter a Valid Name");
    }
    else if(!validator.isEmail(email)){
        throw new Error("Enter a Valid Email");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please Enter a Strong Password..")
    }
}
module.exports = {validateSignUp,};
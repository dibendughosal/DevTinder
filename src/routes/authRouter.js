const express = require('express');
const authRouter = express.Router();

const bcrypt = require('bcrypt');
const { validateSignUp } = require('../utils/validation');
const validator = require('validator');
const User = require('../models/userSchema');
const jwt = require('jsonwebtoken');



authRouter.post("/signup", async (req,res) => {
    try{
        //validate the user data
        validateSignUp(req);

        // Encrypt the password
        const {firstName, lastName, email, password} = req.body;
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash
        });
        await user.save()
        res.send("User added Successfully")
    }
    catch(err){
        res.status(401).send("Error: Please try again ", err.message)
    }
});


authRouter.post("/login", async(req, res)=> {
    const {email, password} = req.body;
    if(!validator.isEmail(email)){
        throw new Error("Please enter a valid email")
    }
    const user = await User.findOne({email});
    if(!user){
        throw new Error("Invalid Credentials");
    }
    const checkPassword = await user.validatePassword(password);
    if(checkPassword){

        const token = await user.getJWT();
        res.cookie("token", token, { expires: new Date(Date.now() + 700000)});
        res.send("Login Successful");
    }
    else{
        res.status(401).send("Invalid Credentials");
    }
})

authRouter.post("/logout", async(req, res) => {
    res.cookie("token", null, { expires: new Date(Date.now())});
    res.send("Logout Successful");
})

module.exports = {authRouter};
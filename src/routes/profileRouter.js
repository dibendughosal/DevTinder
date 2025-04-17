const express = require('express');
const profileRouter = express.Router();

const {userAuth} = require('../middlewares/Auth');
const { validateUserData } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async(req, res)=> {
    try{
        const user = req.user;
        res.send(user);
    }
    catch(err){
        res.status(401).send("Something went wrong.")
    }

})

profileRouter.patch("/profile/edit", userAuth, async(req,res) => {
    try{
        if(!validateUserData(req)){
            throw new Error("Invalid Update Request")
        }
        const user = req.user; // Logged in User 
        if (!user) {
            throw new Error("User not authenticated");
        }
        console.log(user)
        Object.keys(req.body).forEach(key => user[key] = req.body[key]);

        console.log(user)
        await user.save();
        res.send("Profile Updated Successfully");
    }
    catch(err){
        res.status(404).send("Cannot Update!!!!")
    }
})


module.exports = {profileRouter};
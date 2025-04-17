const express = require('express');
const requestRouter = express.Router();

const {userAuth} = require('../middlewares/Auth');


requestRouter.post("/sendConnectionRequest", userAuth, async(req,res)=> {
    try{
        const user = req.user;
        res.send(user.firstName + " sent you a Connection request.");
    }
    catch(error){
        res.status(400).send("something went Wrong.")
    }
})

module.exports = {requestRouter};
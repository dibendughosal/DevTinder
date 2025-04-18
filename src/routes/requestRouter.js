const express = require('express');
const requestRouter = express.Router();

const {userAuth} = require('../middlewares/Auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require("../models/userSchema");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async(req,res) => {
    try{
        const fromUserId = req.user._id;        
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        
        const allowedStatus = ["interested", "ignore"];
        if(!allowedStatus.includes(status)){
            return res.status(404).json({message: "Invalid Status type"})
        }

        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(401).json({
                message: "user not found!"
            })
        }
        const isAlreadyExists = await ConnectionRequest.findOne({
            $or: [
                {fromUserId,toUserId},
                {
                    fromUserId: toUserId,
                    toUserId: fromUserId
                }
            ]
        });

        if(isAlreadyExists){
            return res.status(401).json({
                message: "cannot sent request."
            })
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const data = await connectionRequest.save();

        res.status(200).json({
            message: `${req.user.firstName} is ${status}, ${toUser.firstName}`,
            data,
        })
    }
    catch(error){
        res.status(400).send("something went Wrong.");
    }
})

module.exports = {requestRouter};
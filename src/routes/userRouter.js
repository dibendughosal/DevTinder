const express = require('express');
const userRouter = express.Router();

const {userAuth} = require("../middlewares/Auth")
const ConnectionRequest = require("../models/connectionRequest");
const User = require('../models/userSchema');

userRouter.get("/user/request/received", userAuth, async (req,res)=> {
    const loggedInUser = req.user;

    const data = await ConnectionRequest.find({
        toUserId: loggedInUser._id,
        status: "interested"
    }).populate("fromUserId", "firstName lastName");

    res.status(200).json({
        message: "request fetch Successfully",
        data
    })
})

userRouter.get("/user/connections", userAuth, async(req, res) => {
    try{
        const loggedInUser = req.user;
        const data = await ConnectionRequest.find({
            $or: [
                {toUserId: loggedInUser._id},
                {fromUserId: loggedInUser._id}
            ],
            status: "accepted"
        })
        .populate("fromUserId", ["firstName", "lastName", "about", "photoUrl"])
        .populate("toUserId", ["firstName", "lastName", "about", "photoUrl"])

        const userData = data.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.status(200).json({
            message: "Connection request Fetch",
            data: userData
        })
    }
    catch(err){
        res.status(404).send("Error ----- ", err.message);
    }

})

userRouter.get("/user/feed", userAuth, async(req,res) => {
    try{
        const loggedInUser = req.user;

        const hideUser = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ]
        });

        const hideUserFromFeed = new Set();

        hideUser.forEach( req => {
            hideUserFromFeed.add(req.toUserId.toString());
            hideUserFromFeed.add(req.fromUserId.toString());
        });

        const user = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUserFromFeed) }},
                { _id: { $ne: loggedInUser._id }}
            ]
        }).select("firstName lastName about skill");

        res.status(201).json({
            message: "Feed request Successful",
            data: user
        });
    }
    catch(err){
        res.status(400).send("Error -> ", err.message);
    }
});

module.exports = userRouter;
require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');

const userAuth = async(req, res, next) =>{
    try{
        // read the token
        const {token} = req.cookies;
        if(!token){
            throw new Error("Token is not valid!!!!!!");
        }
        // verify the token
        const decodedObj = jwt.verify(token, process.env.JWT_SECRET);
        const {_id} = decodedObj;

        // find the user
        const user = await User.findById(_id);
        if(!user){
            throw new Error("Invalid credentials.");
        }
        req.user = user;
        next();
    }
    catch(err){
        res.status(401).send("Error!!!!" , err.message);
    }
}
module.exports = {userAuth,};
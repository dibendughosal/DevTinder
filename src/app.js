const express = require('express');
const connectDB = require("./database/db");
const app = express();
const bcrypt = require('bcrypt');
const User = require('./models/userSchema');
const { validateSignUp } = require('./utils/validation');
const cookieParser = require('cookie-parser')
const validator = require('validator');
const jwt = require('jsonwebtoken');
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req,res) => {
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
        res.status(401).send("Error: ", err.message)
    }
});

app.get("/user", async(req,res)=> {
    const email = req.body.email;
    try{
        const users = await User.findOne({email});
        res.send(users);
    }
    catch(err){
        res.status(401).json({
            success: false,
            message: "User Not Found"
        })
    }
})

app.post("/login", async(req, res)=> {
    const {email, password} = req.body;
    if(!validator.isEmail(email)){
        throw new Error("Please enter a valid email")
    }
    const user = await User.findOne({email});
    if(!user){
        throw new Error("Invalid Credentials");
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if(checkPassword){

        const token = jwt.sign({_id: user._id}, "Dev@Tinder$2025")
        res.cookie("token", token);
        res.send("Login Successful");
    }
    else{
        res.status(401).send("Invalid Credentials");
    }
})

app.get("/profile", async(req, res)=> {
    try{
        const {token} = req.cookies

        if(!token){
            throw new Error("Invalid Token")
        }

        const decodedMessage = jwt.verify(token, "Dev@Tinder$2025")
        console.log(decodedMessage);
        const {_id} = decodedMessage;
        console.log("login user is", _id)

        const user = User.findById(_id)
        if(!user){
            throw new Error("Invalid Request")
        }
        res.send("Reading Cookie")
    }
    catch(err){
        res.status(401).send("Something went wrong.")
    }

})

app.get("/feed", async(req, res)=> {
    try{ 
        const user = await User.find({});
        res.send(user);
    }
    catch(err){
        res.status(404).jsonsend("Something went wrong")
    }
});

app.delete("/user", async(req,res)=> {
    const {email} = req.body
    try{
        const user = await User.findOneAndDelete({email})
        res.send("user Deleted Successfully");
    }
    catch(error){
        res.status(404).send("Something Went wrong!")
    }
}) 

app.patch("/user", async(req, res)=> {
    const email = req.body.email;
    const data = req.body // data to be updated

    try{
        const ALLOWED_UPDATES = ["userId", "photoUrl", "gender", "age", "skills"];

    const isUpdatedAllowed = Object.keys(data).every((k)=> ALLOWED_UPDATES.includes(k));

    if(!isUpdatedAllowed){
        throw new Error("Updated not allowed...")
    }

    const user = await User.findOneAndUpdate({email: email}, data);
        res.send("User Updated Successfully");
    }
    catch(error){
        res.status(401).send("user not found");
    }
})

connectDB()
.then(() => {
    console.log("Database Connection Successfully");
    app.listen(7777, () => console.log("Server running at 7777"));
})
.catch((err) => {
    console.error("Error in Connection", err.message);
})
require('dotenv').config();
const express = require('express');
const connectDB = require("./database/db");
const app = express();
const bcrypt = require('bcrypt');
const User = require('./models/userSchema');
const { validateSignUp } = require('./utils/validation');
const cookieParser = require('cookie-parser')
const validator = require('validator');
const jwt = require('jsonwebtoken');
const {userAuth} = require('./middlewares/Auth');
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
        res.status(401).send("Error: Please try again ", err.message)
    }
});

app.post("/login", async(req, res)=> {
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

app.get("/profile", userAuth, async(req, res)=> {
    try{
        const user = req.user;
        res.send(user);
    }
    catch(err){
        res.status(401).send("Something went wrong.")
    }

})
app.post("/sendConnectionRequest", userAuth, async(req,res)=> {
    try{
        const user = req.user;
        res.send(user.firstName + " sent you a Connection request.");
    }
    catch(error){
        res.status(400).send("something went Wrong.")
    }
})

connectDB()
.then(() => {
    console.log("Database Connection Successfully");
    app.listen(process.env.PORT, () => console.log(`Server running at ${process.env.PORT}`));
})
.catch((err) => {
    console.error("Error in Connection", err.message);
})
const express = require('express');
const connectDB = require("./database/db");
const app = express();
const User = require('./models/userSchema');

app.post("/signup", async (req,res) => {
    const user = new User({
        firstName: "Dibendu",
        lastName: "Ghosal",
        email: "dibendughosal@gmail.com",
        password: "Dibyo2002"
    });

    try{
        await user.save()
        res.send("User added Successfully")
    }
    catch(err){
        res.status(401).send("Error", err.message)
    }
});

connectDB()
.then(() => {
    console.log("Database Connection Successfully");
    app.listen(7777, () => console.log("Server running at 7777"));
})
.catch((err) => {
    console.error("Error in Connection", err.message);
})
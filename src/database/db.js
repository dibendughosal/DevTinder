const mongoose = require('mongoose');

const connectDB = async(req, res) => {
    try{
        await mongoose.connect("mongodb://localhost:27017/devTinder")
        res.send("database connection Successfully");
    }
    catch(err){
        console.log("Error...");
    }
}
module.exports = connectDB;
const express = require('express');

const app = express();
app.get("/home", (req,res)=> res.send("<h1>Hey folks!</h1>"));
app.use("/", (req, res)=> res.send("Hello from dashboard"))
app.listen(7777, ()=> console.log("Server running at 7777")
);

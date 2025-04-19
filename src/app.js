require('dotenv').config();
const express = require('express');
const connectDB = require("./database/db");
const app = express();
const cookieParser = require('cookie-parser')

const {profileRouter} = require('./routes/profileRouter');
const {authRouter} = require('./routes/authRouter');
const {requestRouter} = require('./routes/requestRouter');
const userRouter = require("./routes/userRouter");

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
.then(() => {
    console.log("Database Connection Successfully");
    app.listen(process.env.PORT, () => console.log(`Server running at ${process.env.PORT}`));
})
.catch((err) => {
    console.error("Error in Connection", err.message);
})
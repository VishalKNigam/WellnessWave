const express = require("express");
const app = express();
require("dotenv").config();
app.use(express.json());
const cors = require("cors");
const { connection } = require("./Backend/config/db");
const { userRouter } = require("./Backend/routes/users.route");
const port = Number(process.env.PORT) || 8080;
app.use("/users", userRouter);
app.get("/", (req,res)=>{
    res.send("Home");
})
app.listen(port, async()=>{
    try {
        await connection;
        console.log("Connected to the DB");
    } catch (error) {
        console.log(error);
        console.log("Failed to connect DB");
        
    }
    console.log(`Server is running at http://localhost:${port}`);
})

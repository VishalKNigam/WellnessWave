const express = require("express");
const { UserModel } = require("../models/users.model");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const { registrationMiddleware } = require("../middlewares/registration.middleware");
const { loginMiddleware } = require("../middlewares/login.middleware");
const { UserAuthorizationMiddleware } = require("../middlewares/UserAuthorization.middleware");
require("dotenv").config();

// All user
userRouter.get("/", async (req, res) => {
    const { page, limit } = req.query;
    try {
        if (page & limit) {
            let skipped = (+limit * +page) - +limit;
            let users = await UserModel.find().skip(skipped).limit(limit);
            res.send({ users: users });
        } else {
            let users = await UserModel.find();
            res.send({ users: users, hi: 1 });
        }
    } catch (error) {
        res.send({ "error": error.message });
    }

});

// User Registeration
userRouter.post("/register",registrationMiddleware, async (req, res) => {
    try {
        const user = new UserModel(req.body);
        await user.save();
        res.send({ msg: `Welcome, ${req.body.name} Your Registration is Successful!` });
    } catch (error) {
        res.send({ "error": error.message })
    }
});

// User Login
userRouter.post("/login",loginMiddleware, async (req, res) => {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    try {
        const token = jwt.sign({ userId: user._id, role: user.role },
            process.env.jwt_secret_key, { expiresIn: "24h" });
        res.send({
            msg: `Welcome!, ${user.name} Your Login is Successful.`, token: token, userId: user._id,
            role: user.role, name: user.name

        });
    } catch (error) {
        res.send({ err: error.message })

    }
});

// User update
userRouter.patch("/update",UserAuthorizationMiddleware ,async (req,res)=>{
    const {userId,name} = req.body;
    try {
        await UserModel.findByIdAndUpdate(userId,req.body);
        res.send({msg:`${name}'s Details are Updated Successfully.`})
    } catch (error) {
        res.send({err:error.message})
    }
});

// User delete by id
userRouter.delete("/delete/:id",UserAuthorizationMiddleware,async (req,res)=>{
    const {id} = req.params;
    let user = await UserModel.findById(id);
    try {
        let DeleteUser = await UserModel.findByIdAndDelete(id);
        // console.log(DeleteUser);
        res.send({msg:`${user.name}'s Account is Deleted Successfully.`,Deleted_User:DeleteUser})
    } catch (error) {
        res.send({err:error.message})
    }
});

module.exports = { userRouter };


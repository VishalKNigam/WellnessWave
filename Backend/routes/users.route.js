const express = require("express");
const { UserModel } = require("../models/users.model");
const userRouter = express.Router();
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

userRouter.post("/register", async(req, res)=>{
    try {
        const user = new UserModel(req.body);
        await user.save();
        res.send({msg:`Welcome, ${req.body.name} Your Registration is Successful!` });
    } catch (error) {
        res.send({ "error": error.message })
    }
})

module.exports = { userRouter };


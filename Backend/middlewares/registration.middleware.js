const { UserModel } = require("../models/users.model");
require("dotenv").config();
const bcrypt = require("bcrypt");
const saltRounds = Number(process.env.saltRounds);

const registrationMiddleware = async (req, res, next) => {
    const { email, password, mobile } = req.body;
    try {
        const emailUser = await UserModel.find({ email });
        const mobileUser = await UserModel.find({ mobile });
        if (emailUser.length != 0) {
            res.send({
                msg: "This email is already registered. Please Try login!",
                err: false
            })

        } else if (mobileUser.length != 0) {
            res.send({
                msg: "This mobile is already registered. Please Try login!",
                err: false
            })
        }else{
            bcrypt.hash(password, saltRounds, (err,hash)=>{
                if(err){
                    console.log(err);
                    res.send({err: err.message, err:false});
                    return;
                }
                req.body.password = hash;
                next();
            })
        }
    } catch (error) {
        res.send({err:err.message});
    }
};
module.exports = {registrationMiddleware};
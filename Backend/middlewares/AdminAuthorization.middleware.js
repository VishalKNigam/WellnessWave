const jwt = require("jsonwebtoken");
const { } = require("bcrypt");
const { UserModel } = require("../models/users.model");
const AdminAuthorizationMiddleware = async (req, res, next) => {
    let token = req.headers.authorization;
    if (token) {
        try {
            var decoded = jwt.verify(token.split(" ")[1], process.env.jwt_secret_key);
            if (decoded) {
                let user = await UserModel.findById(decoded.userID);
                if (user.role == "Admin") {
                    next();
                } else {
                    res.send({ msg: "You are not authorized to perform this operation." });
                }
            } else {
                res.send({ msg: "Please Log in 1" })
            }
        }
        catch (err) {
            res.send({ err: err.message });
        }
    } else {
        res.send({ msg: "Please Log in 2" })
    }
}
module.exports = {AdminAuthorizationMiddleware};
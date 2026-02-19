const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');


async function authMiddleware(req, res, next){
    try{
        const token = req.cookies.token || req.header.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: "Invalid token. User not found." });
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token." });
    }
}

module.exports = {
    authMiddleware
};
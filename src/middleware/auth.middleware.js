const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const tokenBlacklistModel = require('../models/blackList.model');


async function authMiddleware(req, res, next){
    try{
        const token = req.cookies.token || req.header.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }
        const isBlacklisted = await tokenBlacklistModel.findOne({token});
        if(isBlacklisted){
            return res.status(401).json({ message: "Invalid token. Token is blacklisted." });
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

async function authSystemUserMiddleware(req, res, next){
    const token = req.cookies.token || req.header.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }
    const isBlacklisted = await tokenBlacklistModel.findOne({token});
    if(isBlacklisted){
        return res.status(401).json({ message: "Invalid token. Token is blacklisted." });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.userId).select("+systemUser");
        if (!user.systemUser) {
            return res.status(403).json({ message: "Access denied. Not a system user." });
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token." });
    }
}

module.exports = {
    authMiddleware,
    authSystemUserMiddleware
};
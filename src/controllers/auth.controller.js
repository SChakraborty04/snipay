const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const emailService = require("../services/v2.email.service")


/**
 * - user register controller
 * - POST /api/auth/register
 */

async function userRegisterController(req,res){
    const {email,password,name} = req.body;
    const isExists = await userModel.findOne({email});
    if(isExists){
        return res.status(422).json({
            success: false,
            message: "Email already exists"
        });
    }
    const user = await userModel.create({
        email,
        password,
        name
    });

    const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn: "3d"})
    res.cookie("token", token)
    res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token
    });
    emailService.sendRegistrationEmail(user.email,user.name);
}
/**
 * - user login controller
 * - POST /api/auth/login
 */
async function userLoginController(req,res){
    const {email,password} = req.body;
    const user = await userModel.findOne({email}).select("+password");
    if(!user){
        return res.status(404).json({
            success: false,
            message: "User not found with this email"
        });
    }
    const isMatch = await user.comparePassword(password);
    if(!isMatch){
        return res.status(401).json({
            success: false,
            message: "Invalid credentials"
        });
    }
    const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn: "3d"})
    res.cookie("token", token)
    res.status(200).json({
        success: true,
        message: "User logged in successfully",
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token
    });
}

module.exports = {
    userRegisterController,
    userLoginController
}
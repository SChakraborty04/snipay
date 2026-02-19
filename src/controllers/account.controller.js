const accountModel = require('../models/account.model');




async function createAccountController(req, res){
    try{
        const user = req.user;
        const account = await accountModel.create({
            user: user._id
        })
        if(!account){
            res.status(500).json({
                message: "Account creation failed. Internal Server Error."
            })
        }
        res.status(201).json({
            data: account,
            message: "Account successfully created."
        })
    }catch(e){
        res.status(500).json({
            message: "Account creation failed. Internal Server Error."
        })
    }
}

module.exports = {
    createAccountController
}
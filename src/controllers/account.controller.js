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

async function getAccountsController(req,res){
    const accounts = await accountModel.find({
        user: req.user._id
    });
    res.status(200).json({
        accounts,
        message: "Accounts retrieved successfully."
    })
}

async function getAccountBalanceController(req,res){
    const {accountId} = req.params;
    const account = await accountModel.findOne({
        _id: accountId,
        user: req.user._id
    })
    if(!account){
        return res.status(404).json({
            success: false,
            message: "Account not found"
        });
    }
    const balance = await account.getBalance();
    res.status(200).json({
        success: true,
        accountId: account._id,
        balance
    });
}

module.exports = {
    createAccountController,
    getAccountsController,
    getAccountBalanceController
}
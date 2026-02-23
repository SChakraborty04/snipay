const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const accountModel = require("../models/account.model");
const emailService = require("../services/v2.email.service");
const { default: mongoose } = require("mongoose");

/**
 * Complete transation Business Logic
 * 1. Validate request
 * 2. Validate idempotency key
 * 3. Check account Status
 * 4. Derive sender balance from ledger
 * 5. Create transaction (PENDING)
 * 6. Create Debit ledger entry
 * 7. Create credit ledger entry
 * 8. Mark transaction as COMPLETED
 * 9. Commit MongoDB session
 * 10. Send email notification to sender and receiver
 */

async function createTransaction(req,res){
    // Step 1: Validate request
    const {fromAccount, toAccount, amount, idempotencyKey} = req.body;

    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            success: false,
            message: "Missing required fields"
        });
    }

    if(fromAccount === toAccount){
        return res.status(400).json({
            success: false,
            message: "Sender and receiver accounts cannot be the same"
        });
    }
    const fromUserAccount = await accountModel.findById(fromAccount);
    const toUserAccount = await accountModel.findById(toAccount);
    if(!fromUserAccount || !toUserAccount){
        return res.status(400).json({
            success: false,
            message: "One or both accounts not found"
        });
    }
    // Step 2: Validate idempotency key
    const isTransactionExists = await transactionModel.findOne({idempotencyKey});
    if(isTransactionExists){
        if(isTransactionExists.status === "COMPLETED"){
            return res.status(200).json({
                success: true,
                message: "Transaction already completed",
                transaction: isTransactionExists
            });
        }
        if(isTransactionExists.status === "PENDING"){
            return res.status(200).json({
                success: true,
                message: "Transaction is still pending",
                transaction: isTransactionExists
            });
        }
        if(isTransactionExists.status === "FAILED"){
            return res.status(500).json({
                success: false,
                message: "Previous transaction attempt failed. You can retry.",
                transaction: isTransactionExists
            });
        }
        if(isTransactionExists.status === "REVERSED"){
            return res.status(500).json({
                success: false,
                message: "Transaction was reversed. You can retry.",
                transaction: isTransactionExists
            });
        }
    }

    //Step 3: Check account Status
    if(fromUserAccount.status !== "ACTIVE"){
        return res.status(400).json({
            success: false,
            message: "Sender account is not active"
        });
    }
    if(toUserAccount.status !== "ACTIVE"){
        return res.status(400).json({
            success: false,
            message: "Receiver account is not active"
        });
    }

    // Step 4: Derive sender balance from ledger
    const balance = await fromUserAccount.getBalance();
    if(balance < amount){
        return res.status(400).json({
            success: false,
            message: "Insufficient balance in sender account",
            currentBalance: balance,
            requestedAmount: amount
        });
    }
    // Step 5: Create transaction (PENDING)
    const session = await mongoose.startSession();
    session.startTransaction();

    const transaction = await transactionModel.create({
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING"
    },{session});
    const debitLedgerEntry = await ledgerModel.create({
        account: fromAccount,
        amount,
        transaction: transaction._id,
        type: "DEBIT"
    },{session});
    const creditLedgerEntry = await ledgerModel.create({
        account: toAccount,
        amount,
        transaction: transaction._id,
        type: "CREDIT"
    },{session});

    transaction.status = "COMPLETED";
    await transaction.save({session});

    await session.commitTransaction();
    session.endSession();

    // Step 10: Send email notification to sender and receiver
    await emailService.sendTransactionEmail(fromUserAccount.user.email,fromUserAccount.user.name,amount,fromUserAccount,"DEBIT");
    await emailService.sendTransactionEmail(toUserAccount.user.email,toUserAccount.user.name,amount,toUserAccount,"CREDIT");
    
    return res.status(201).json({
        success: true,
        message: "Transaction completed successfully",
        transaction
    });
}

module.exports = {
    createTransaction
}
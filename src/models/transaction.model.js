const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: [true,"Transaction must be associated with an account"],
        index: true,
    },
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: [true,"Transaction must be associated with an account"],
        index: true,
    },
    status:{
        type: String,
        enum: {
            values: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
            message: 'Invalid transaction status',
        },
        default: 'PENDING', 
    },
    amount: {
        type: Number,
        required: [true, "Transaction amount is required"],
        min: [0.01, "Transaction amount must be greater than zero"],
    },
    idempotencyKey: {
        type: String,
        required: [true, "Idempotency key is required"],
        index: true,
        unique: true,
    }
},{
    timestamps: true,
})

const transactionModel = mongoose.model("Transaction", transactionSchema);

module.exports = transactionModel;
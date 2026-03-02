const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: [true,"Reward must be associated with an account"],
        index: true,
    },
    transactionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
        required: [true,"Reward must be associated with a transaction"],
        index: true,
    },
    points: {
        type: Number,
        required: [true, "Reward points are required"],
        min: [0, "Reward points cannot be negative"],
    }
},{
    timestamps: true,
})

const rewardModel = mongoose.model("Reward", rewardSchema);

module.exports = rewardModel;
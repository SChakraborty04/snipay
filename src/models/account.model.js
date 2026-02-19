const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Account must be associated with user"],
        index: true
    },
    status:{
        type: String,
        enum:{
            values:["ACTIVE","FROZEN","CLOSED"],
            message: "Status must be either ACTIVE, FROZEN or CLOSED",
            
        },
        default: "ACTIVE"
    },
    currency:{
        type: String,
        required: [true, "Currency is required for creating an account"],
        default: "INR"
    }
},{
    timestamps: true
});

//Compound index on both user and status
accountSchema.index({user: 1, status: 1});

const accountModel = mongoose.model("Account", accountSchema);

module.exports = accountModel;
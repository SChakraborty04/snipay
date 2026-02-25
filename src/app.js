const express = require('express');
const cookieParser = require('cookie-parser');



const app = express();
app.use(express.json());
app.use(cookieParser());

/**
 * Routes required
 */
const authRouter = require('./routes/auth.routes');
const accountRouter = require('./routes/account.routes');
const transactionRouter = require('./routes/transaction.routes');

app.get("/",(req,res)=>{
    res.status(200).json({
        success: true,
        message: "Welcome to the SniPay Bank Backend",
        apiVersion: "1.0.0",
        includes: "Backend API for user authentication, account management, and transaction processing with email notifications."
    });
});


/**
 * Use routes
 */
app.use("/api/auth", authRouter);
app.use("/api/accounts", accountRouter);
app.use("/api/transactions", transactionRouter);


module.exports = app;
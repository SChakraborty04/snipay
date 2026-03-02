const express = require('express');
const transactionController = require('../controllers/transaction.controller');
const { authSystemUserMiddleware,authMiddleware } = require('../middleware/auth.middleware');


const router = express.Router();

/**
 * - POST /api/transactions
 * - Create a new transaction
 */

router.post("/",authMiddleware,transactionController.createTransaction);

/**
 * - POST /api/transactions/system/initial-funds
 * - Create initial funds transaction from system user
 */
router.post("/system/initial-funds",authSystemUserMiddleware,transactionController.createInitialFundsTransaction);

/**
 * - GET /api/transactions/:accountId
 * - Get all transactions of a specific account
 * - Protected Route
 */
router.get("/:accountId",authMiddleware,transactionController.getTransactionsByAccountId);


module.exports = router;
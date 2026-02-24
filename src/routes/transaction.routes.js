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

module.exports = router;
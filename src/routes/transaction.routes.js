const express = require('express');
const authMiddleware = require('../middleware/auth.middleware').authMiddleware;
const transactionController = require('../controllers/transaction.controller');


const router = express.Router();

/**
 * - POST /api/transactions
 * - Create a new transaction
 */

router.post("/",authMiddleware,transactionController.createTransaction);

module.exports = router;
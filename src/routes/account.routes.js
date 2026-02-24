const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const { createAccountController, getAccountsController, getAccountBalanceController } = require('../controllers/account.controller');

const router = express.Router();

/**
 * - POST /api/accounts
 * - Create a new account
 * - Protected Route
 */
router.post("/",authMiddleware.authMiddleware,createAccountController)


/**
 *  - GET /api/accounts
 *  - Get all accounts of the authenticated user
 *  - Protected Route
 */
router.get("/",authMiddleware.authMiddleware,getAccountsController)

/**
 * - GET /api/accounts/balance/:accountId
 * - Get balance of a specific account
 * - Protected Route
 */
router.get("/balance/:accountId",authMiddleware.authMiddleware,getAccountBalanceController)


module.exports = router;
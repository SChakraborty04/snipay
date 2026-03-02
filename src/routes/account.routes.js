const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const { createAccountController, getAccountsController, getAccountBalanceController,getAccountRewardsPointsController } = require('../controllers/account.controller');

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

/**
 * - GET /api/accounts/rewards/:accountId
 * - Get reward points of a specific account
 * - Protected Route
 */
router.get("/rewards/:accountId",authMiddleware.authMiddleware,getAccountRewardsPointsController)


module.exports = router;
const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const { createAccountController } = require('../controllers/account.controller');

const router = express.Router();

/**
 * - POST /api/comments
 * - Create a new account
 * - Protected Route
 */
router.post("/",authMiddleware.authMiddleware,createAccountController)



module.exports = router;
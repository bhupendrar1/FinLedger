const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware')
const accountController = require('../controllers/account.controller');


const router = express.Router();


/**
 * // post - /api/accounts/
 * - create a new account 
 */
router.post('/', authMiddleware.authMiddleware, accountController.createAccountController);



/**
 * GET /api/accounts/
 * - Get all accounts of the logged - in user
 * - protected route
 */

router.get('/', authMiddleware.authMiddleware, accountController.getUserAccountsController);

/**
 * GET /api/accounts/balance/:accountId
 * - Get the balance of a specific account by accountId
 * - protected route
 */


router.get('/balance/:accountId', authMiddleware.authMiddleware, accountController.getAccountBalanceController);

module.exports = router;
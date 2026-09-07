const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();


// Register route - POST  /api/auth/register
router.post('/register', authController.UserRegisterController);


// Login route - POST /api/auth/login
router.post('/login', authController.UserLoginController);

// Logout route - POST /api/auth/logout
router.post('/logout', authController.UserLogoutController);

module.exports = router;

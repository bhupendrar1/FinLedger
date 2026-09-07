const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const emailService = require('../services/email.service');
const tokenBlackListModel = require('../models/blacklist.model');



/**
 * - User Registration Controller
 * - POST: /api/auth/register 
 */
async function UserRegisterController(req, res) {

    const { email, name, password } = req.body;

    // Check if the email already exists in the database
    const isExists = await userModel.findOne({ 
        email: email 
    });

    if (isExists) {
        return res.status(422).json({ 
            message: 'Email already exists',
            status: "Failed"
        });
    }

    // Create a new user
    const user = await userModel.create({
        email,
        name,
        password
    });

    // Generate a JWT token for the registered user
    const token = jwt.sign(
        { userId:user._id },
         process.env.JWT_SECRET,
        { expiresIn: '1h' });

        res.cookie('token', token);

    res.status(201).json({
         message: 'User registered successfully',
          user: {
           _id: user._id,
           email: user.email,
           name: user.name
          },
          token
         });

         await emailService.SendRegistrationEmail(user.email, user.name);
}


/**
 * - User Login Controller
 * - POST: /api/auth/login 
 */

async function UserLoginController(req, res) {
    
    const { email , password } = req.body;

    const user = await userModel.findOne(
        { email }).select('+password');

        if(!user) {
            return res.status(401).json({
                message: 'Invalid email or password',
            });
        }

         const isValidPassword = await user.comparePassword(password);
         
        if(!isValidPassword) {
            return res.status(401).json({
                message: 'Invalid email or password',
            });
        }


        // Generate a JWT token for the logged-in user
        const token = jwt.sign(
            { userId:user._id },
             process.env.JWT_SECRET,
            { expiresIn: '1h' });

            res.cookie('token', token);

        res.status(200).json({
             message: 'User logged in successfully',
              user: {
               _id: user._id,
               email: user.email,
               name: user.name
              },
              token
             });
}


/**
 * - User Logout Controller
 * - POST: /api/auth/logout
 */

async function UserLogoutController(req, res) {
    
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(200).json({
            message: 'user logout successfully',
        });
    }

   

    await tokenBlackListModel.create({ 
        token: token
    });

     res.clearCookie("token")

    res.status(200).json({
        message: 'User logged out successfully',
    });


}


module.exports = { 
    UserRegisterController,
    UserLoginController,
    UserLogoutController
 };
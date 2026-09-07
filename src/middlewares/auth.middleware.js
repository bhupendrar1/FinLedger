const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const tokenBlackListModel = require('../models/blacklist.model');




async function authMiddleware(req, res, next) {

    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

    if(!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.'
         });
    }


    const isBlacklisted = await tokenBlackListModel.findOne({ token });


    if (isBlacklisted) {
        return res.status(401).json({ 
            message: 'Unauthorized access. Token is Invalid.' 
        });
    }


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await userModel.findById(decoded.userId);

        req.user = user;
        next();

    }catch (error) {
        return res.status(400).json({ message: 'Invalid token.' });
    }


}

async function authSystemUserMiddleware(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if(!token) {
        return res.status(401).json({ 
            message: 'Unauthorized. No token provided.' 
        });
    }

   const isBlacklisted = await tokenBlackListModel.findOne({ token });
   
    if (isBlacklisted) {    
        return res.status(401).json({ 
            message: 'Unauthorized access. Token is Invalid.' 
        });

    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel
    .findById(decoded.userId)
    .select('+systemUser');

    if (!user) {
            return res.status(401).json({
                message: 'User not found.'
            });
        }

       if(!user.systemUser) {
            return res.status(403).json({ 
                message: 'Forbidden. You are not authorized to perform this action.' 
            });
       }

       req.user = user;
      return next();
    }
    catch (error) {
     console.error('System auth error', error);
         
        return res.status(400).json({ 
            message: 'Invalid token.' 
        });
    }
}



module.exports = {
    authMiddleware,
    authSystemUserMiddleware
}
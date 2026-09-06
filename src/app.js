const express = require('express');
const cookieParser = require('cookie-parser');



// Importing routes
const accountRoutes = require('./routes/account.routes');
const authRoutes = require('./routes/auth.routes');
const transactionRoutes = require('./routes/transaction.routes');



const app = express();

app.use(express.json());
app.use(cookieParser());      



//use routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);




module.exports = app;
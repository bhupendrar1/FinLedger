const mongoose = require('mongoose');


const TransactionSchema = new mongoose.Schema({
    
   fromAccount:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'account',
    required: [true, 'From account reference is required'],
    index: true
   },
   toAccount:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'account',
    required: [true, 'To account reference is required'],
    index: true
   },
   status: {
    type: String,
    enum: {
        values: ['PENDING', 'COMPLETED', 'FAILED', 'REVERSED'],
        message: 'Status must be either PENDING, COMPLETED, FAILED or REVERSED',
    },
    default: 'PENDING'
   },
   amount:{
    type: Number,
    required: [true, 'Amount is required for creating a transaction'],
    min: [0, 'Amount must be a positive number']
   },
   // Add an idempotency key to ensure that the same transaction is not processed multiple times
   idempotencyKey: {
    type: String,
    required: [true, 'Idempotency key is required for creating a transaction'],
    unique: true,
    index: true
   }
},{
    timestamps: true
})  


const transactionModel = mongoose.model('transaction', TransactionSchema);

module.exports = transactionModel;
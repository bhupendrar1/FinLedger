const transactinModel = require('../models/transaction.model');
const ledgerModel = require('../models/ledger.model');
const accountModel = require('../models/account.model');
const emailService = require('../services/email.service');
const mongoose = require('mongoose');


/**
 * - Create a new transaction
 *  THE 10- STEP TRANSACTION PROCESS
 * 1. Validate request
 * 2. Validate Idempotence Key
 * 3. Check account status
 * 4. Derive Sender balance from ledger
 * 5. Create transaction (PENDING)
 * 6. Create DEBIT ledger entry
 * 7. Create CREDIT ledger entry
 * 8. Mark transaction as COMPLETED
 * 9. Commit MongoDB Session 
 * 10. Send email notification 
 */


async function createTransaction(req, res) {
   /**
    * 1. Validate request
    */
   const {fromAccount, toAccount, amount, idempotencyKey } = req.body;

    if( !fromAccount || !toAccount || !amount || !idempotencyKey ) {
          return res.status(400).json({ 
            message: 'fromAccount , toAccount , amount , and idempotencyKey are required',
            
         })
    }

    const fromUserAccount = await accountModel.findOne({
      _id: fromAccount,
    })

    const toUserAccount = await accountModel.findOne({
      _id: toAccount,
    })

    if(!fromUserAccount || !toUserAccount) {
      return res.status(404).json({
        message: 'Invalid fromAccount or toAccount'
      })
    }


    /**
     * 2. Validate Idempotency Key
     */

    const isTransactionAlreadyExists = await transactinModel.findOne({
      idempotencyKey: idempotencyKey
    })

    if(isTransactionAlreadyExists) {
       if(isTransactionAlreadyExists.status === 'COMPLETED') {
        return res.status(200).json({
          message: 'Transaction already completed',
          transaction: isTransactionAlreadyExists
        })
       } 

       if(isTransactionAlreadyExists.status === 'PENDING') {
        return res.status(200).json({
          message: 'Transaction is still pending',
        })
       }

       if(isTransactionAlreadyExists.status === 'FAILED') {
         return res.status(200).json({
            message: 'Transaction has failed',
         })
          }

          if(isTransactionAlreadyExists.status === 'REVERSED') {
            return res.status(200).json({
              message: 'Transaction has been reversed',
            })
          }
           
    }


    /**
     * 3. Check account status
     */

    if (fromUserAccount.status !== 'ACTIVE' || toUserAccount.status !== 'ACTIVE') {
      return res.status(400).json({
        message: 'From or to account is not active'
      })
    }

    /**
     * 4. Derive Sender balance from ledger
     */

    const balance = await fromUserAccount.getBalance()

   if(balance < amount) {
     return res.status(400).json({
       message: `Insufficient balance current balance is ${balance}, required 
       amount is ${amount}`
     })
   }

/**
 * 5. Create transaction (PENDING)
 */


    const session = await transactinModel.startSession();
    session.startTransaction();

    const  transaction = await transactinModel.create({
      fromAccount,
      toAccount,
      amount,
      idempotencyKey,
      status: 'PENDING'
    }, { session })

/**
 * Create DEBIT ledger entry
 */

   const debitLedgerEntry = await ledgerModel.create({
      account: fromAccount,
      type: 'DEBIT',
      amount: amount,
      transaction: transaction._id
    }, { session })

    /**
     * create CREDIT ledger entry
     */

    const creditLedgerEntry = await ledgerModel.create({
      account: toAccount,
      type: 'CREDIT',
      amount: amount,
      transaction: transaction._id
    }, { session })

    /**
     * 8. Mark transaction as COMPLETED
     */

   transation.status = 'COMPLETED';
    await transation.save({ session })

   await session.commitTransaction();
   session.endSession();

   /**
    * 9. Send email notification
    */

   await emailService.sendTransactionEmail(req.user.email, req.user.name, amount, toAccount )
  
    return res.status(201).json({
        message: "Transaction completed successfully",
        transaction: transaction
    })
    
}


async function createInitialFundsTransaction(req, res) {
  const { toAccount, amount, idempotencyKey } = req.body;

  if( !toAccount || !amount || !idempotencyKey ) {
    return res.status(400).json({ 
      message: 'toAccount , amount , and idempotencyKey are required',
   })
  }

  const toUserAccount = await accountModel.findOne({
    _id: toAccount,
  })

  if(!toUserAccount) {
    return res.status(404).json({
      message: 'Invalid toAccount'
    })
  }

const fromUserAccount = await accountModel.findOne({
    user: req.user._id,
    status: 'ACTIVE'
});

if(!fromUserAccount) {
  return res.status(404).json({
    message: 'System user account not found'
  })
}


const session = await mongoose.startSession();
session.startTransaction();

const transaction = await transactinModel.create({
  fromAccount: fromUserAccount._id,
  toAccount,
  amount,
  idempotenceKey,
  status: 'PENDING' 
}, { session })


const debitLedgerEntry = await ledgerModel.create({
  account: fromUserAccount._id,
  type: 'DEBIT',
  amount: amount,
  transaction: transaction._id
}, { session })

const creditLedgerEntry = await ledgerModel.create({
  account: toAccount,
  type: 'CREDIT',
  amount: amount,
  transaction: transaction._id  
}, { session })

transaction.status = 'COMPLETED';
await transaction.save({ session })

await session.commitTransaction();
session.endSession();

return  res.status(201).json({
  message: "Initial funds transaction completed successfully",
  transaction: transaction
})


}

module.exports = {
    createTransaction,
    createInitialFundsTransaction   
}

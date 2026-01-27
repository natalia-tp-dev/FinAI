const express = require('express')
const { createTransaction, getYearlyTrend, getCategoryExpenses, getTotalBalance, getTransactions, updateTransaction, deleteTransaction } = require('../controller/transaction-controllers')

const router = express.Router()

router.get('/get-yearly-trend/:user_id', getYearlyTrend)
router.get('/get-total-balance/:user_id', getTotalBalance)
router.get('/get-transactions/:user_id', getTransactions)
router.get('/get-categories-expenses/:user_id', getCategoryExpenses)
router.put('/update-transaction/:id', updateTransaction)
router.post('/create-transaction', createTransaction)
router.delete('/delete-transaction/:id', deleteTransaction)

module.exports = router
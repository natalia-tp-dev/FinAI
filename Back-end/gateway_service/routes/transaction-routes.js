const express = require('express')
const { createTransaction, getYearlyTrend, getCategoryExpenses, getTotalBalance, getTransactions, updateTransaction, deleteTransaction } = require('../controller/transaction-controllers')

const router = express.Router()

/**
 * @openapi
 * /api/transactions/get-yearly-trend/{user_id}:
 * get:
 * tags: [Transactions]
 * summary: Get yearly financial trend
 * parameters:
 * - in: path
 * name: user_id
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: Monthly income and expense trends for the year.
 */
router.get('/get-yearly-trend/:user_id', getYearlyTrend)

/**
 * @openapi
 * /api/transactions/get-total-balance/{user_id}:
 * get:
 * tags: [Transactions]
 * summary: Get user total balance
 * parameters:
 * - in: path
 * name: user_id
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: Current total balance calculated from all transactions.
 */
router.get('/get-total-balance/:user_id', getTotalBalance)

/**
 * @openapi
 * /api/transactions/get-transactions/{user_id}:
 * get:
 * tags: [Transactions]
 * summary: List all transactions for a user
 * parameters:
 * - in: path
 * name: user_id
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: A list of all income and expense records.
 */
router.get('/get-transactions/:user_id', getTransactions)

/**
 * @openapi
 * /api/transactions/get-categories-expenses/{user_id}:
 * get:
 * tags: [Transactions]
 * summary: Get expenses grouped by category
 * parameters:
 * - in: path
 * name: user_id
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: Breakdown of spending per category for charts.
 */
router.get('/get-categories-expenses/:user_id', getCategoryExpenses)

/**
 * @openapi
 * /api/transactions/update-transaction/{id}:
 * put:
 * tags: [Transactions]
 * summary: Update an existing transaction
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * amount:
 * type: number
 * description:
 * type: string
 * responses:
 * 200:
 * description: Transaction updated successfully.
 */
router.put('/update-transaction/:id', updateTransaction)

/**
 * @openapi
 * /api/transactions/create-transaction:
 * post:
 * tags: [Transactions]
 * summary: Create a new transaction
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required: [user_id, amount, type, category_id]
 * properties:
 * user_id:
 * type: string
 * amount:
 * type: number
 * type:
 * type: string
 * enum: [INCOME, EXPENSE]
 * category_id:
 * type: integer
 * description:
 * type: string
 * responses:
 * 201:
 * description: Transaction created successfully.
 */
router.post('/create-transaction', createTransaction)

/**
 * @openapi
 * /api/transactions/delete-transaction/{id}:
 * delete:
 * tags: [Transactions]
 * summary: Delete a transaction
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: Transaction deleted successfully.
 */
router.delete('/delete-transaction/:id', deleteTransaction)

module.exports = router
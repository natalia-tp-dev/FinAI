const express = require('express')
const { createTransaction } = require('../controller/transaction-controllers')

const router = express.Router()

router.post('/create-transaction', createTransaction)

module.exports = router
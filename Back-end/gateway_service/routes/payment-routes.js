const express = require('express')
const { authenticate } = require('../middlewares/user-middlewares/auth')
const { createUserPlan, payUserPlan } = require('../controller/payment-controllers')
const router = express.Router()

router.post('/pay', authenticate, payUserPlan)
router.post('/create-free-account', authenticate, createUserPlan)

module.exports = router
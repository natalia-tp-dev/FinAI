const express = require('express')
const { analyze_indiviual_goal } = require('../controller/ai_controllers')
const { getSavingGoals, updateSavingAmount, updateStatus } = require('../controller/saving-goals-controllers')
const { createSavingGoal } = require('../middlewares/goal-middlewares/create-goal')
const { authenticate } = require('../middlewares/user-middlewares/auth')
const { getPaymentInfo } = require('../middlewares/payment-middlewares/payment')
const router = express.Router()

router.get('/get-saving-goals/:user_id', getSavingGoals)
router.put('/update-amount/:goal_id', updateSavingAmount)
router.put('/update-status/:goal_id', updateStatus)
router.post('/create-and-analyze', authenticate, getPaymentInfo, createSavingGoal, analyze_indiviual_goal)

module.exports = router
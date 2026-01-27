const express = require('express')
const { authenticate } = require('../middlewares/user-middlewares/auth')
const { get_report } = require('../controller/ai_controllers')
const router = express.Router()

router.get('/get-report/:goal_id', authenticate, get_report)

module.exports = router
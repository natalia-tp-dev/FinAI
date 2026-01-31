const express = require('express')
const router = express.Router()
const { signUp, signIn, profileInfo, logOut, health }  = require('../controller/user-controllers')
const { validateRegister, validateLogin } = require('../middlewares/user-middlewares/validator')
const { authenticate } = require('../middlewares/user-middlewares/auth')
const { getPaymentInfo } = require('../middlewares/payment-middlewares/payment')

router.get('/profile-info', authenticate, getPaymentInfo ,profileInfo)
router.get('/health', health)
router.post('/sign-up', validateRegister, signUp)
router.post('/sign-in', validateLogin, signIn)
router.post('/log-out', logOut)

module.exports = router
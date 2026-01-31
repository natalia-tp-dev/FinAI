const express = require('express')
const { authenticate } = require('../middlewares/user-middlewares/auth')
const { createUserPlan, payUserPlan } = require('../controller/payment-controllers')
const router = express.Router()

/**
 * @openapi
 * /api/payments/pay:
 * post:
 * tags:
 * - Payments & Subscriptions
 * summary: Process premium subscription payment
 * security:
 * - cookieAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * subscriptionId:
 * type: string
 * example: "I-BW9S09BMA9S"
 * plan_type:
 * type: string
 * example: "PREMIUM_MONTHLY"
 * responses:
 * 200:
 * description: Payment processed and subscription activated.
 * 400:
 * description: Payment capture failed at PayPal.
 * 401:
 * description: Unauthorized - Valid session cookie required.
 */
router.post('/pay', authenticate, payUserPlan)

/**
 * @openapi
 * /api/payments/create-free-account:
 * post:
 * tags:
 * - Payments & Subscriptions
 * summary: Initialize free plan
 * security:
 * - cookieAuth: []
 * responses:
 * 201:
 * description: Free plan successfully initialized.
 * 401:
 * description: Unauthorized.
 */
router.post('/create-free-account', authenticate, createUserPlan)

module.exports = router
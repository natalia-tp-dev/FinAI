const express = require('express')
const router = express.Router()
const { signUp, signIn, profileInfo, logOut, health }  = require('../controller/user-controllers')
const { validateRegister, validateLogin } = require('../middlewares/user-middlewares/validator')
const { authenticate } = require('../middlewares/user-middlewares/auth')
const { getPaymentInfo } = require('../middlewares/payment-middlewares/payment')

/**
 * @openapi
 * /api/users/profile-info:
 * get:
 * tags: [Authentication & User]
 * summary: Get profile and subscription info
 * description: Returns basic user data combined with their current payment/plan status.
 * security:
 * - cookieAuth: []
 * responses:
 * 200:
 * description: User profile and payment data retrieved successfully.
 * 401:
 * description: Unauthorized - Valid session required.
 */
router.get('/profile-info', authenticate, getPaymentInfo, profileInfo)

/**
 * @openapi
 * /api/users/health:
 * get:
 * tags: [Authentication & User]
 * summary: Gateway health check
 * responses:
 * 200:
 * description: Server is up and running.
 */
router.get('/health', health)

/**
 * @openapi
 * /api/users/sign-up:
 * post:
 * tags: [Authentication & User]
 * summary: Register a new user
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required: [email, password, name]
 * properties:
 * email:
 * type: string
 * example: "user@example.com"
 * password:
 * type: string
 * example: "SecurePass123!"
 * name:
 * type: string
 * example: "John Doe"
 * responses:
 * 201:
 * description: User registered successfully.
 * 400:
 * description: Validation error or user already exists.
 */
router.post('/sign-up', validateRegister, signUp)

/**
 * @openapi
 * /api/users/sign-in:
 * post:
 * tags: [Authentication & User]
 * summary: User login
 * description: Authenticates the user and sets a session cookie.
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required: [email, password]
 * properties:
 * email:
 * type: string
 * password:
 * type: string
 * responses:
 * 200:
 * description: Login successful, cookie set.
 * 401:
 * description: Invalid credentials.
 */
router.post('/sign-in', validateLogin, signIn)

/**
 * @openapi
 * /api/users/log-out:
 * post:
 * tags: [Authentication & User]
 * summary: Log out user
 * description: Clears the authentication session cookie.
 * responses:
 * 200:
 * description: Logged out successfully.
 */
router.post('/log-out', logOut)

module.exports = router
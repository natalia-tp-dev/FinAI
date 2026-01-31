const express = require('express')
const router = express.Router()
const { signUp, signIn, profileInfo, logOut, health }  = require('../controller/user-controllers')
const { validateRegister, validateLogin } = require('../middlewares/user-middlewares/validator')
const { authenticate } = require('../middlewares/user-middlewares/auth')
const { getPaymentInfo } = require('../middlewares/payment-middlewares/payment')

/**
 * @openapi
 * /api/users/profile-info:
 *   get:
 *     tags:
 *       - Authentication & User
 *     summary: Get profile info
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */
router.get('/profile-info', authenticate, getPaymentInfo, profileInfo)

/**
 * @openapi
 * /api/users/health:
 *   get:
 *     tags:
 *       - Authentication & User
 *     summary: Health check
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/health', health)

/**
 * @openapi
 * /api/users/sign-up:
 *   post:
 *     tags:
 *       - Authentication & User
 *     summary: Register user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/sign-up', validateRegister, signUp)

/**
 * @openapi
 * /api/users/sign-in:
 *   post:
 *     tags:
 *       - Authentication & User
 *     summary: Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.post('/sign-in', validateLogin, signIn)

/**
 * @openapi
 * /api/users/log-out:
 *   post:
 *     tags:
 *       - Authentication & User
 *     summary: Logout
 *     responses:
 *       200:
 *         description: OK
 */
router.post('/log-out', logOut)

module.exports = router
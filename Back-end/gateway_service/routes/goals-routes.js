const express = require('express')
const { analyze_indiviual_goal } = require('../controller/ai_controllers')
const { getSavingGoals, updateSavingAmount, updateStatus } = require('../controller/saving-goals-controllers')
const { createSavingGoal } = require('../middlewares/goal-middlewares/create-goal')
const { authenticate } = require('../middlewares/user-middlewares/auth')
const { getPaymentInfo } = require('../middlewares/payment-middlewares/payment')
const router = express.Router()

/**
 * @openapi
 * /api/ai/get-saving-goals/{user_id}:
 *   get:
 *     tags:
 *       - Goals & AI
 *     summary: Get all saving goals for a user
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of saving goals retrieved successfully.
 *       404:
 *         description: User not found.
 */
router.get('/get-saving-goals/:user_id', getSavingGoals)

/**
 * @openapi
 * /api/ai/update-amount/{goal_id}:
 *   put:
 *     tags:
 *       - Goals & AI
 *     summary: Update current saving amount
 *     parameters:
 *       - in: path
 *         name: goal_id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 150.50
 *     responses:
 *       200:
 *         description: Amount updated successfully.
 */
router.put('/update-amount/:goal_id', updateSavingAmount)

/**
 * @openapi
 * /api/ai/update-status/{goal_id}:
 *   put:
 *     tags:
 *       - Goals & AI
 *     summary: Update goal status
 *     parameters:
 *       - in: path
 *         name: goal_id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [IN_PROGRESS, COMPLETED, CANCELLED]
 *     responses:
 *       200:
 *         description: Status updated successfully.
 */
router.put('/update-status/:goal_id', updateStatus)

/**
 * @openapi
 * /api/ai/create-and-analyze:
 *   post:
 *     tags:
 *       - Goals & AI
 *     summary: Create a goal and trigger AI analysis
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               target_amount:
 *                 type: number
 *               deadline:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Goal created and AI analysis triggered.
 *       401:
 *         description: Unauthorized.
 *       402:
 *         description: Payment required.
 */
router.post('/create-and-analyze', authenticate, getPaymentInfo, createSavingGoal, analyze_indiviual_goal)

module.exports = router
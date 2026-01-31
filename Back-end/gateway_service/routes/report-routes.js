const express = require('express')
const { authenticate } = require('../middlewares/user-middlewares/auth')
const { get_report } = require('../controller/ai_controllers')
const router = express.Router()

/**
 * @openapi
 * /api/reports/get-report/{goal_id}:
 *   get:
 *     tags:
 *       - AI Reports
 *     summary: Retrieve AI analysis report
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: goal_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the goal
 *     responses:
 *       200:
 *         description: AI report retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 feasibility_score:
 *                   type: integer
 *                   example: 85
 *                 ai_advice:
 *                   type: string
 *                   example: "Based on your spending, we recommend reducing dining out by 10%."
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Report not found.
 */
router.get('/get-report/:goal_id', authenticate, get_report)

module.exports = router
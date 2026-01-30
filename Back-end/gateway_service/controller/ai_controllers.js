
const axios = require('axios')
const pool = require('../config/config')

const analyze_indiviual_goal = async (req, res) => {
    try {
        const newGoal = req.goal
        const userId = newGoal.userId

        const sql2 = `
            SELECT 
                c.name as category,
                t.amount,
                t.type
            FROM transactions t
            JOIN categories c ON t.category_id = c.id
            WHERE t.user_id = UUID_TO_BIN(?)
            ORDER BY t.transaction_date DESC
            LIMIT 30;
        `
        const [transactions] = await pool.execute(sql2, [userId])
        const aiPayload = {
            user_uuid: userId,
            target_goal: {
                id: newGoal.id,
                name: newGoal.name,
                target_amount: newGoal.target_amount,
                current_amount: newGoal.current_amount,
                deadline: newGoal.deadline
            },
            recent_transactions: transactions
        }

        const aiServiceResponse = await axios.post(`${process.env.AI_URL}/ai/generate-report/${newGoal.id}`, aiPayload, {timeout: 60000})
        res.status(200).json(aiServiceResponse.data)

    } catch (err) {
        console.error(err.message)
        if (err.code === 'ECONNREFUSED' || err.timeout) {
            return res.status(201).json({
                message: 'Meta creada, pero el servicio de IA no está disponible.',
                data: newGoal, 
                aiReport: null
            });
        }

        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

const get_report = async (req, res) => {
    try {
        const { goal_id } = req.params
        const { id } = req.user
        const response = await axios.get(`${process.env.AI_URL}/ai/get-report/${goal_id}`, { params: { user_uuid: id} })
        res.status(200).json(response.data)
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

module.exports = { analyze_indiviual_goal, get_report }
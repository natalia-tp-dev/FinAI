const pool = require('../config/config')
const axios = require('axios')

const getSavingGoals = async (req, res) => {
    try {
        const {user_id} = req.params
        const sql = `
            SELECT id, name, target_amount, current_amount, deadline, status
            FROM saving_goals
            WHERE user_id = UUID_TO_BIN(?);
        `

        const [goals] = await pool.execute(sql, [user_id])
        let feasibilities = {}

        try {
            const aiResponse = await axios.get(`${process.env.AI_URL}/ai/get-feasibility`, {
                params: {user_uuid: user_id}
            })
            feasibilities = aiResponse.data
        } catch (error) {
            console.error('AI Service not available')
        }

        const finalResult = goals.map(goal => ({
            ...goal,
            feasibility: feasibilities[goal.id] || 'Pending'
        }))

        res.status(200).json({result: finalResult})

    } catch (error) {
        console.error(error)
        res.status(500).json({error: 'Internal Server Error'})
    }
}

const updateSavingAmount = async (req, res) => {
    try {
        const { goal_id } = req.params;
        const { amount } = req.body; 

        if (!goal_id  || amount === undefined) {
            return res.status(400).json({ error: 'Missing ID or amount' });
        }

        const [result] = await pool.query(
            'UPDATE saving_goals SET current_amount = ? WHERE id = ?',
            [amount, goal_id ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Goal not found' });
        }

        res.status(200).json({
            message: 'Amount updated successfully'
        });

    } catch (err) {
        console.error('MySQL Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const updateStatus = async (req, res) => {
    try {
        const { goal_id } = req.params;
        const { status } = req.body;

        await pool.query("UPDATE saving_goals SET `status` = ? WHERE id = ?", [status, goal_id]);

        res.status(200).json({ message: 'Succesfully updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { getSavingGoals, updateSavingAmount, updateStatus }
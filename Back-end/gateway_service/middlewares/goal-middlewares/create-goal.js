const pool = require('../../config/config')

const createSavingGoal =  async (req, res, next) => {
    try {
        const { userId, name, target_amount, current_amount, deadline } = req.body
        const { is_in_trial, plan_type } = req.payment

        const sql1 = `INSERT INTO saving_goals (user_id, name, target_amount, current_amount, deadline, status) VALUES (UUID_TO_BIN(?),?,?,?,?,'ACTIVE')`
        const [result] = await pool.execute(sql1, [userId, name, target_amount, current_amount || 0, deadline])
        
        const newGoalID = result.insertId
    
        const newGoal = {
            id: newGoalID,
            userId,
            name,
            target_amount,
            current_amount,
            deadline
        }
        req.goal = newGoal

        if (!is_in_trial && plan_type !== 'PREMIUM' && plan_type !== 'ULTIMATE') {
            return res.status(200).json({message: 'Your saving goal has been created!'})
        }
        next()
    } catch (error) {
        console.error(error)
        res.status(500).json({error:'Internal Server Error'})
    }
}

module.exports = { createSavingGoal }
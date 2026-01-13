
const pool = require('../config/config')

const createTransaction = async (req, res) => {
    try {
        const { user_id, category_id, amount, type, description, transaction_date } = req.body
    
        if (!user_id || !category_id || !amount || !type || !transaction_date) {
            return res.status(400).json({
                error: 'Missing required fields'
            })
        }
    
        const finalDescription =  description || null
    
        const sql = 'INSERT INTO transactions (user_id, category_id, amount, type, description, transaction_date) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?);'
        await pool.execute(sql, [user_id, category_id, amount, type, finalDescription, transaction_date])
    
        res.status(201).json({
            message: 'Your transaction has been added'
        })
    } catch (error) {

        console.error(error)
        res.status(500).json({
            error: 'Internal server error'
        })
    }
}

const getYearlyTrend = async (req,res) => {
    try {
        const { user_id } = req.params
        const sql = `
            SELECT 
                DATE_FORMAT(transaction_date, '%Y-%m-%d') as date,
                SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END) as income,
                SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) as expense
            FROM transactions
            WHERE user_id = UUID_TO_BIN(?)
                AND MONTH(transaction_date) = MONTH()`

    } catch (error) {
        
    }
}

module.exports = { createTransaction }
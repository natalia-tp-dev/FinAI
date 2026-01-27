
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


const getTransactions = async (req, res) => {
    try {
        const { user_id } = req.params; 
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const sql = `
            SELECT 
                t.id as id, 
                DATE_FORMAT(t.transaction_date, '%d %b %Y') as date, 
                t.description, 
                c.name as category,
                t.category_id,
                c.icon as icon,
                c.color as color,
                c.background_color as bgColor,
                t.type, 
                t.amount 
            FROM transactions t
            LEFT JOIN categories c ON t.category_id = c.id
            WHERE t.user_id = UUID_TO_BIN(?) 
            ORDER BY t.transaction_date DESC
            LIMIT ? OFFSET ?;
        `;

        const [rows] = await pool.query(sql, [user_id, limit, offset]);
        
        const countSql = `SELECT COUNT(*) as total FROM transactions WHERE user_id = UUID_TO_BIN(?)`;
        const [countRows] = await pool.query(countSql, [user_id]);

        res.status(200).json({
            data: rows,
            pagination: {
                total: countRows[0].total,
                page,
                totalPages: Math.ceil(countRows[0].total / limit) || 1
            }
        });
    } catch (error) {
        console.error("SQL Error:", error);
        res.status(500).json({ error: error.message });
    }
}

const getYearlyTrend = async (req,res) => {
    try {
        const { user_id } = req.params
        const sql = `
            SELECT 
                DATE_FORMAT(transaction_date, '%b') as name,
                SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END) as income,
                SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) as expense
            FROM transactions
            WHERE user_id = UUID_TO_BIN(?)
                AND YEAR(transaction_date) = 2026
            GROUP BY MONTH(transaction_date), name
            ORDER BY MONTH(transaction_date);`
        
        const [rows] = await pool.execute(sql, [user_id])

        const formattedData = rows.map(row => ({
            name: row.name,
            series: [
                {
                    name: 'Incomes',
                    value: Number(row.income)
                },
                {
                    name: 'Expenses',
                    value: Number(row.expense)
                }
            ]
        }))

        res.status(200).json({formattedData})
    } catch (error) {
        res.status(500).json({error: 'An error occurred'})
    }
}

const getCategoryExpenses = async (req, res) => {
    try {
        const { user_id } = req.params
        const sql = `
            SELECT 
                c.name as category,
                SUM(t.amount) as total
            FROM transactions t
            JOIN categories c ON t.category_id = c.id
            WHERE t.user_id = UUID_TO_BIN(?)
                AND t.type = 'EXPENSE'
                AND YEAR(t.transaction_date) = YEAR(CURRENT_DATE())
            GROUP BY c.name;`
        
            const [ rows ] = await pool.execute(sql, [user_id])
    
            const response = { 
                labels: rows.map(row => row.category),
                values: rows.map(row => Number(row.total))
            }
    
            res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
}

const getTotalBalance = async (req, res) => {
    try {
        const {user_id} = req.params
        const sql = `
            SELECT 
                COALESCE(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END), 0) as totalIncomes,
                COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0) as totalExpenses,
                COALESCE(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE -amount END), 0) as totalBalance,
                COALESCE(SUM(CASE WHEN type = 'INCOME' AND MONTH(transaction_date) = MONTH(CURRENT_DATE()) THEN amount ELSE 0 END), 0) as monthlyIncomes
            FROM transactions
            WHERE user_id = UUID_TO_BIN(?);
        `
        const [rows] = await pool.execute(sql, [user_id])
        const balance = rows[0]

        res.status(200).json(balance)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error while trying to get total balance' })
    }
}

const updateTransaction = async (req, res) => {
    try {
        const {id} = req.params
        const { description, amount, type, category_id, transaction_date } = req.body

        const [rows] = await pool.query("SELECT * FROM transactions WHERE id = ?", [id]);
        if (rows.length === 0) return res.status(404).json({ message: "Not found" });
        const current = rows[0];

        const hasChanges = 
            current.description !== description ||
            current.amount != amount ||
            current.type !== type ||
            current.category_id != category_id ||
            new Date(current.transaction_date).toISOString().split('T')[0] !== transaction_date;

        if (!hasChanges) {
            return res.status(400).json({error: 'No changes detected. Please modify at least one field.'})
        }

        const sql = `
            UPDATE transactions SET description=?, amount=?, type=?, category_id=?, transaction_date=? WHERE id=?
        `
        await pool.execute(sql, [description, amount, type, category_id, transaction_date, id])

        res.json({ message: "Updated successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteTransaction = async(req, res) => {
    try {
        const { id } = req.params

        const [result] = await pool.execute('DELETE FROM transactions WHERE id = ?;', [id])
        if (result.length == 0) {
            return res.status(404).json({error: 'Transaction not found'})
        }

        res.status(200).json({message: 'Succesfully deleted'})
    } catch (err) {
        res.status(500).json({ error: 'Internal service error' });
    }
}

module.exports = { createTransaction, getYearlyTrend, getCategoryExpenses, getTotalBalance, getTransactions, updateTransaction, deleteTransaction }
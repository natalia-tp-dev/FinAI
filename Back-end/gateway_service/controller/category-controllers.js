const pool = require('../config/config')



const createCategory = async (req, res) => {
    try {
        //Getting info and validating it
        const { name, icon, color, background_color, user_id } = req.body

        //Inserting info in database
        const sql = 'INSERT INTO categories (name, icon, color, background_color, user_id) VALUES (?, ?, ?, ?, UUID_TO_BIN(?));'
        await pool.execute(sql, [name, icon, color, background_color, user_id])
        res.status(201).json({
            message: 'Succesfully inserted'
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            error: 'Internal error'
        })
    }
}

const getCategories = async (req, res) => {
    try {
        const { userId } = req.query
        //Consulting db to get each category
        const sql = 'SELECT id, name, icon, color, background_color FROM categories WHERE user_id IS NULL OR user_id = UUID_TO_BIN(?);'
        const [rows] = await pool.execute(sql, [userId])
        res.status(201).json(rows)
    } catch (error) {
        res.status(500).json({
            error: 'Internal error'
        })
    }
}

const getCategorie = async (req, res) => {
    try {
        const id = req.id
        if (!id) {
            return res.status(400).json({
                error: 'Missing category id'
            })
        }

        const sql = 'SELECT name, icon, color, background_color FROM categories WHERE id = UUID_TO_BIN(?);'
        const [rows] = await pool.execute(sql,[id])

        res.status(201).json({
            rows
        })

    } catch (error) {
        res.status(500).json({
            error: 'Internal server error'
        })
    }
}

module.exports = { createCategory, getCategories, getCategorie }
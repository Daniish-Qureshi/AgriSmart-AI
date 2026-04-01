const pool = require('../config/db')

exports.saveSoilRecord = async (req, res) => {
    try {
        const { ph_level, nitrogen, phosphorus, potassium, suggestion } = req.body
        const userId = req.user.id
        // get user location for the record
        const userRes = await pool.query('SELECT location FROM users WHERE id = $1', [userId])
        const location = userRes.rows[0]?.location || ''

        const result = await pool.query(
            `INSERT INTO soil_records (user_id, ph_level, nitrogen, phosphorus, potassium, location, suggestion)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [userId, ph_level, nitrogen, phosphorus, potassium, location, suggestion]
        )

        res.status(201).json(result.rows[0])
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.getSoilRecords = async (req, res) => {
    try {
        const userId = req.user.id
        const result = await pool.query(
            `SELECT * FROM soil_records WHERE user_id = $1 ORDER BY created_at DESC`,
            [userId]
        )
        res.json(result.rows)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

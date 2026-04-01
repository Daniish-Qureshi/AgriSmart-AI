const pool = require('../config/db')

exports.saveSimulation = async (req, res) => {
    try {
        const { crop_name, budget, season, acres, estimated_profit, risk_percent } = req.body
        const userId = req.user.id

        const result = await pool.query(
            `INSERT INTO simulations (user_id, crop_name, budget, season, acres, estimated_profit, risk_percent)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [userId, crop_name, budget, season, acres, estimated_profit, risk_percent]
        )

        res.status(201).json(result.rows[0])
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.getSimulations = async (req, res) => {
    try {
        const userId = req.user.id
        const result = await pool.query(
            `SELECT * FROM simulations WHERE user_id = $1 ORDER BY created_at DESC`,
            [userId]
        )
        res.json(result.rows)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

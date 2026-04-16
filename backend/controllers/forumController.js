const pool = require('../config/db')

exports.saveQuestion = async (req, res) => {
  try {
    const { question, details } = req.body
    const userId = req.user.id

    if (!question || question.trim().length === 0) {
      return res.status(400).json({ message: 'Question cannot be empty' })
    }

    const result = await pool.query(
      `INSERT INTO forum_posts (user_id, question, details)
       VALUES ($1, $2, $3) RETURNING *`,
      [userId, question.trim(), details || '']
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getQuestions = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT f.id, f.user_id, f.question, f.details, f.created_at,
              u.name AS user_name, u.location AS user_location
       FROM forum_posts f
       JOIN users u ON u.id = f.user_id
       ORDER BY f.created_at DESC`
    )

    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

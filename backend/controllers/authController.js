const pool = require('../config/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const jwtSecret = process.env.JWT_SECRET || 'agri-smart-dev-secret'

exports.register = async (req, res) => {
  try {
    const { name, email, password, location } = req.body
    const exists = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    if (exists.rows.length > 0)
      return res.status(400).json({ message: 'Email already registered' })
    const hashed = await bcrypt.hash(password, 10)
    const result = await pool.query(
      'INSERT INTO users (name, email, password, location) VALUES ($1, $2, $3, $4) RETURNING id, name, email, location',
      [name, email, hashed, location]
    )
    const token = jwt.sign({ id: result.rows[0].id }, jwtSecret, { expiresIn: '7d' })
    res.status(201).json({ user: result.rows[0], token })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    if (result.rows.length === 0)
      return res.status(400).json({ message: 'Email not found' })
    const valid = await bcrypt.compare(password, result.rows[0].password)
    if (!valid)
      return res.status(400).json({ message: 'Wrong password' })
    const token = jwt.sign({ id: result.rows[0].id }, jwtSecret, { expiresIn: '7d' })
    res.json({ user: { id: result.rows[0].id, name: result.rows[0].name, email: result.rows[0].email, location: result.rows[0].location }, token })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getMe = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, location FROM users WHERE id = $1', [req.user.id])
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
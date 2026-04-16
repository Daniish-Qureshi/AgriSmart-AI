const express = require('express')
const router = express.Router()
const pool = require('../config/db')
const auth = require('../middleware/auth')
const { saveQuestion, getQuestions } = require('../controllers/forumController')

// Get all simulations of user
router.get('/simulation', auth, async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store')
    const result = await pool.query(
      'SELECT * FROM simulations WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Save simulation
router.post('/simulation', auth, async (req, res) => {
  try {
    const { crop_name, budget, season, acres, estimated_profit, risk_percent } = req.body
    const result = await pool.query(
      'INSERT INTO simulations (user_id, crop_name, budget, season, acres, estimated_profit, risk_percent) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [req.user.id, crop_name, budget, season, acres, estimated_profit, risk_percent]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get soil records
router.get('/soil', auth, async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store')
    const result = await pool.query(
      'SELECT * FROM soil_records WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Save soil record
router.post('/soil', auth, async (req, res) => {
  try {
    const { ph_level, nitrogen, phosphorus, potassium, location, suggestion } = req.body
    const result = await pool.query(
      'INSERT INTO soil_records (user_id, ph_level, nitrogen, phosphorus, potassium, location, suggestion) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [req.user.id, ph_level, nitrogen, phosphorus, potassium, location, suggestion]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Community Forum routes
router.get('/forum', auth, getQuestions)
router.post('/forum', auth, saveQuestion)

module.exports = router
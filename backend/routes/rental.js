const express = require('express')
const router = express.Router()
const pool = require('../config/db')
const auth = require('../middleware/auth')

// Get all equipment listings
router.get('/listings', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT el.*, u.name AS owner_name, u.location AS owner_location FROM equipment_listings el LEFT JOIN users u ON el.owner_id = u.id WHERE el.available = true ORDER BY created_at DESC'
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get single listing
router.get('/listings/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT el.*, u.name AS owner_name, u.location AS owner_location FROM equipment_listings el LEFT JOIN users u ON el.owner_id = u.id WHERE el.id = $1',
      [req.params.id]
    )
    if (result.rows.length === 0) return res.status(404).json({ message: 'Listing not found' })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Create listing
router.post('/listings', auth, async (req, res) => {
  try {
    const { title, category, description, price_per_day, location } = req.body
    const result = await pool.query(
      'INSERT INTO equipment_listings (owner_id, title, category, description, price_per_day, location, available) VALUES ($1,$2,$3,$4,$5,$6,true) RETURNING *',
      [req.user.id, title, category, description, price_per_day, location]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Update listing
router.put('/listings/:id', auth, async (req, res) => {
  try {
    const { title, category, description, price_per_day, location, available } = req.body
    const listing = await pool.query('SELECT * FROM equipment_listings WHERE id = $1', [req.params.id])
    if (listing.rows.length === 0) return res.status(404).json({ message: 'Listing not found' })
    if (listing.rows[0].owner_id !== req.user.id) return res.status(403).json({ message: 'Not authorized' })

    const result = await pool.query(
      'UPDATE equipment_listings SET title=$1, category=$2, description=$3, price_per_day=$4, location=$5, available=$6, updated_at=NOW() WHERE id=$7 RETURNING *',
      [title, category, description, price_per_day, location, available, req.params.id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Delete listing
router.delete('/listings/:id', auth, async (req, res) => {
  try {
    const listing = await pool.query('SELECT * FROM equipment_listings WHERE id = $1', [req.params.id])
    if (listing.rows.length === 0) return res.status(404).json({ message: 'Listing not found' })
    if (listing.rows[0].owner_id !== req.user.id) return res.status(403).json({ message: 'Not authorized' })

    await pool.query('DELETE FROM equipment_listings WHERE id = $1', [req.params.id])
    res.json({ message: 'Listing deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get current user requests
router.get('/requests', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT rr.*, el.title AS listing_title, el.price_per_day, el.location AS equipment_location FROM rental_requests rr JOIN equipment_listings el ON rr.listing_id = el.id WHERE rr.user_id = $1 ORDER BY rr.created_at DESC',
      [req.user.id]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Create rental request
router.post('/requests', auth, async (req, res) => {
  try {
    const { listing_id, start_date, end_date, message } = req.body
    const result = await pool.query(
      'INSERT INTO rental_requests (user_id, listing_id, start_date, end_date, message, status) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [req.user.id, listing_id, start_date, end_date, message, 'pending']
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Update rental request status
router.put('/requests/:id', auth, async (req, res) => {
  try {
    const { status } = req.body
    const request = await pool.query('SELECT rr.*, el.owner_id FROM rental_requests rr JOIN equipment_listings el ON rr.listing_id = el.id WHERE rr.id = $1', [req.params.id])
    if (request.rows.length === 0) return res.status(404).json({ message: 'Request not found' })
    if (request.rows[0].owner_id !== req.user.id) return res.status(403).json({ message: 'Not authorized' })

    const result = await pool.query(
      'UPDATE rental_requests SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *',
      [status, req.params.id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Owner ke equipment pe aayi saari requests
router.get('/my-requests', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        rr.id, rr.start_date, rr.end_date, rr.message, rr.status, rr.created_at,
        el.title as equipment_title, el.category, el.price_per_day,
        u.name as requester_name, u.location as requester_location
      FROM rental_requests rr
      JOIN equipment_listings el ON rr.listing_id = el.id
      JOIN users u ON rr.user_id = u.id
      WHERE el.owner_id = $1
      ORDER BY rr.created_at DESC
    `, [req.user.id])
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Request accept/reject
router.patch('/requests/:id', auth, async (req, res) => {
  try {
    const { status } = req.body // 'accepted' or 'rejected'
    const result = await pool.query(`
      UPDATE rental_requests SET status = $1 
      WHERE id = $2 RETURNING *
    `, [status, req.params.id])
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router

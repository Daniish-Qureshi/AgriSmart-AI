const express = require('express')
const router = express.Router()
const pool = require('../config/db')
const auth = require('../middleware/auth')
const Razorpay = require('razorpay')
const crypto = require('crypto')

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

// Get or create wallet
router.get('/', auth, async (req, res) => {
  try {
    let wallet = await pool.query('SELECT * FROM wallets WHERE user_id = $1', [req.user.id])
    if (wallet.rows.length === 0) {
      wallet = await pool.query(
        'INSERT INTO wallets (user_id, balance) VALUES ($1, 0) RETURNING *',
        [req.user.id]
      )
    }
    res.json(wallet.rows[0])
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get transactions
router.get('/transactions', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM wallet_transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
      [req.user.id]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Create Razorpay order
router.post('/create-order', auth, async (req, res) => {
  try {
    const { amount } = req.body
    if (!amount || amount < 1) return res.status(400).json({ message: 'Valid amount dalo' })
    if (amount > 100000) return res.status(400).json({ message: 'Max ₹1,00,000 allowed' })

    const order = await razorpay.orders.create({
      amount: amount * 100, // paise mein
      currency: 'INR',
      receipt: `wallet_${req.user.id}_${Date.now()}`
    })
    res.json({ orderId: order.id, amount, key: process.env.RAZORPAY_KEY_ID })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Verify payment & add to wallet
router.post('/verify-payment', auth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body

    // Signature verify
    const sign = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex')

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed' })
    }

    // Add to wallet
    await pool.query(
      'INSERT INTO wallets (user_id, balance) VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET balance = wallets.balance + $2, updated_at = NOW()',
      [req.user.id, amount]
    )

    // Transaction record
    await pool.query(
      'INSERT INTO wallet_transactions (user_id, type, amount, description, status, payment_id) VALUES ($1,$2,$3,$4,$5,$6)',
      [req.user.id, 'credit', amount, `Razorpay se add kiya (${razorpay_payment_id})`, 'completed', razorpay_payment_id]
    )

    const wallet = await pool.query('SELECT * FROM wallets WHERE user_id = $1', [req.user.id])
    res.json({ message: '✅ Payment successful! Wallet updated.', wallet: wallet.rows[0] })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Withdraw
router.post('/withdraw', auth, async (req, res) => {
  try {
    const { amount } = req.body
    if (!amount || amount <= 0) return res.status(400).json({ message: 'Valid amount dalo' })

    const wallet = await pool.query('SELECT * FROM wallets WHERE user_id = $1', [req.user.id])
    if (!wallet.rows.length || Number(wallet.rows[0].balance) < amount) {
      return res.status(400).json({ message: 'Balance kam hai' })
    }

    await pool.query(
      'UPDATE wallets SET balance = balance - $1, updated_at = NOW() WHERE user_id = $2',
      [amount, req.user.id]
    )
    await pool.query(
      'INSERT INTO wallet_transactions (user_id, type, amount, description, status) VALUES ($1,$2,$3,$4,$5)',
      [req.user.id, 'debit', amount, 'Wallet se withdraw kiya', 'completed']
    )

    const updated = await pool.query('SELECT * FROM wallets WHERE user_id = $1', [req.user.id])
    res.json({ message: '✅ Withdraw ho gaya!', wallet: updated.rows[0] })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Internal debit (rental payment, etc.)
router.post('/debit', auth, async (req, res) => {
  try {
    const { amount, description } = req.body
    const wallet = await pool.query('SELECT * FROM wallets WHERE user_id = $1', [req.user.id])
    if (!wallet.rows.length || Number(wallet.rows[0].balance) < amount) {
      return res.status(400).json({ message: 'Wallet mein balance kam hai' })
    }

    await pool.query(
      'UPDATE wallets SET balance = balance - $1, updated_at = NOW() WHERE user_id = $2',
      [amount, req.user.id]
    )
    await pool.query(
      'INSERT INTO wallet_transactions (user_id, type, amount, description, status) VALUES ($1,$2,$3,$4,$5)',
      [req.user.id, 'debit', amount, description, 'completed']
    )

    const updated = await pool.query('SELECT * FROM wallets WHERE user_id = $1', [req.user.id])
    res.json({ message: 'Payment successful', wallet: updated.rows[0] })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Welcome bonus (one time)
router.post('/welcome-bonus', auth, async (req, res) => {
  try {
    // Check if bonus already given
    const existing = await pool.query(
      "SELECT * FROM wallet_transactions WHERE user_id = $1 AND description LIKE '%Welcome Bonus%'",
      [req.user.id]
    )
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Bonus pehle hi mil chuka hai' })
    }

    await pool.query(
      'INSERT INTO wallets (user_id, balance) VALUES ($1, 500) ON CONFLICT (user_id) DO UPDATE SET balance = wallets.balance + 500, updated_at = NOW()',
      [req.user.id]
    )
    await pool.query(
      'INSERT INTO wallet_transactions (user_id, type, amount, description, status) VALUES ($1,$2,$3,$4,$5)',
      [req.user.id, 'credit', 500, '🎁 Welcome Bonus — AgriSmart mein aapka swagat hai!', 'completed']
    )

    const wallet = await pool.query('SELECT * FROM wallets WHERE user_id = $1', [req.user.id])
    res.json({ message: '🎁 ₹500 Welcome Bonus mila!', wallet: wallet.rows[0] })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
const express = require('express')
const router = express.Router()
const Groq = require('groq-sdk')

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{
        role: 'system',
        content: 'Tu ek agriculture expert hai jo Indian farmers ki help karta hai. Hindi/Hinglish me short aur helpful jawab do — 2-3 lines me.'
      }, {
        role: 'user',
        content: message
      }],
      max_tokens: 300
    })
    res.json({ reply: completion.choices[0].message.content })
  } catch (err) {
    console.error('AI Error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

router.post('/soil-suggest', async (req, res) => {
  try {
    const { ph, nitrogen, phosphorus, potassium, location } = req.body
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{
        role: 'user',
        content: `Tu ek soil expert hai. Is soil data ke basis par Hindi/Hinglish me 3-4 specific suggestions do:
        pH: ${ph}, Nitrogen: ${nitrogen}, Phosphorus: ${phosphorus}, Potassium: ${potassium}, Location: ${location || 'India'}
        Format: bullet points me, short aur practical`
      }],
      max_tokens: 300
    })
    res.json({ suggestion: completion.choices[0].message.content })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/simulate-advice', async (req, res) => {
  try {
    const { crop, acres, season, budget, profit, risk } = req.body
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{
        role: 'user',
        content: `Tu ek farming advisor hai. Is simulation ke basis par Hindi/Hinglish me 3-4 practical tips do:
        Crop: ${crop}, Acres: ${acres}, Season: ${season}, Budget: ₹${budget}, 
        Expected Profit: ₹${profit}, Risk: ${risk}%`
      }],
      max_tokens: 300
    })
    res.json({ advice: completion.choices[0].message.content })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
const express = require('express')
const router = express.Router()
const Groq = require('groq-sdk')
const pool = require('../config/db')
const jwt = require('jsonwebtoken')

const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    throw new Error('Missing GROQ_API_KEY environment variable')
  }
  return new Groq({ apiKey })
}

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body
    const groq = getGroqClient()
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
    const groq = getGroqClient()
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
    console.error('AI Error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

router.post('/simulate-advice', async (req, res) => {
  try {
    const { crop, acres, season, budget, profit, risk } = req.body
    const groq = getGroqClient()
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
    console.error('AI Error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

router.post('/disease-scan', async (req, res) => {
  try {
    const { imageName, crop, symptoms, imageData } = req.body

    if (!imageData) {
      return res.status(400).json({ error: 'Image data is required for disease scan.' })
    }

    const description = imageName ? `Uploaded image file: ${imageName}.` : ''
    const cropInfo = crop ? `Crop: ${crop}.` : 'Crop type not specified.'
    const symptomInfo = symptoms ? `Symptoms described: ${symptoms}.` : 'Symptoms description not provided.'

    const groq = getGroqClient()
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'Tu ek Indian kheti expert hai jo plant disease detection aur crop treatment mein madad karta hai. Jawab short, pratical aur Hinglish me do. Agar exact identification image se nahi ho sakti, tab bhi likely disease aur 3 practical treatment steps batao.'
        },
        {
          role: 'user',
          content: `Ek farmer ne plant image upload kiya hai for disease detection. ${cropInfo} ${description} ${symptomInfo} Please turant batao ki kya disease ho sakta hai aur kya treatment karna chahiye.`
        }
      ],
      max_tokens: 350
    })

    const reply = completion.choices[0].message.content
    let userId = null
    const authHeader = req.headers.authorization || ''
    if (authHeader.startsWith('Bearer ')) {
      try {
        const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET)
        userId = decoded.id
      } catch (authErr) {
        console.warn('Disease scan: invalid auth token, saving scan without user id')
      }
    }

    try {
      await pool.query(
        'INSERT INTO disease_scans (user_id, image_name, crop, symptoms, diagnosis) VALUES ($1, $2, $3, $4, $5)',
        [userId, imageName, crop, symptoms, reply]
      )
    } catch (dbErr) {
      console.error('Disease scan save error:', dbErr.message)
    }

    res.json({ diagnosis: reply })
  } catch (err) {
    console.error('Disease scan error:', err.message)
    res.status(500).json({ error: err.message || 'Disease scan me issue hua. Dobara try karein.' })
  }
})

module.exports = router
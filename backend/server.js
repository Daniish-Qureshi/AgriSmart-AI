const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const pool = require('./config/db')

dotenv.config()

const app = express()

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://agri-smart-ai-xi.vercel.app/',
    /\.vercel\.app$/  // sabhi vercel subdomains allow
  ],
  credentials: true
}))

app.use(express.json())

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/ai', require('./routes/ai'))
app.use('/api/data', require('./routes/data'))

// DB Tables Create
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        location VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS simulations (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        crop_name VARCHAR(100),
        budget DECIMAL,
        season VARCHAR(50),
        acres DECIMAL,
        estimated_profit DECIMAL,
        risk_percent INT,
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS soil_records (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        ph_level DECIMAL,
        nitrogen VARCHAR(20),
        phosphorus VARCHAR(20),
        potassium VARCHAR(20),
        location VARCHAR(100),
        suggestion TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `)
    console.log('✅ Database tables ready')
  } catch (err) {
    console.error('DB Error:', err.message)
  }
}

initDB()

app.get('/', (req, res) => res.json({ message: 'AgriSmart API Running ✅' }))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
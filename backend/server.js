const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
const pool = require('./config/db')

dotenv.config({ path: path.resolve(__dirname, '.env') })

if (!process.env.JWT_SECRET) {
  console.warn('⚠️ JWT_SECRET is not defined. Using a development fallback secret. Set JWT_SECRET in backend/.env for production.')
  process.env.JWT_SECRET = 'agri-smart-dev-secret'
}

console.log('✅ JWT_SECRET loaded:', process.env.JWT_SECRET ? 'yes' : 'no')

const app = express()

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://agri-smart-ai-xi.vercel.app/',
    /\.vercel\.app$/  // sabhi vercel subdomains allow
  ],
  credentials: true
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

app.use((req, res, next) => {
  console.log('REQ', req.method, req.originalUrl)
  next()
})

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/ai', require('./routes/ai'))
const dataRouter = require('./routes/data')
app.use('/api/data', dataRouter)
console.log('Loaded /api/data routes:', dataRouter.stack.filter(s=>s.route).map(s=>({path:s.route.path, methods:s.route.methods})))
app.use('/api/rental', require('./routes/rental'))
app.use('/api/wallet', require('./routes/wallet'))

// DB Tables Create
const initDB = async () => {
  if (!process.env.DATABASE_URL) {
    console.warn('⚠️ DATABASE_URL is not set. Skipping database initialization.')
    return
  }

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
      CREATE TABLE IF NOT EXISTS equipment_listings (
        id SERIAL PRIMARY KEY,
        owner_id INT REFERENCES users(id),
        title VARCHAR(150) NOT NULL,
        category VARCHAR(100),
        description TEXT,
        price_per_day DECIMAL NOT NULL,
        location VARCHAR(100),
        available BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS rental_requests (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        listing_id INT REFERENCES equipment_listings(id),
        start_date DATE,
        end_date DATE,
        status VARCHAR(50) DEFAULT 'pending',
        message TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS disease_scans (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        image_name VARCHAR(255),
        crop VARCHAR(100),
        symptoms TEXT,
        diagnosis TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS forum_posts (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        question TEXT NOT NULL,
        details TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS wallets (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) UNIQUE NOT NULL,
  balance DECIMAL DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wallet_transactions (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) NOT NULL,
  type VARCHAR(20) NOT NULL,
  amount DECIMAL NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'completed',
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
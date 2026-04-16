const { Pool } = require('pg')
require('dotenv').config()

if (!process.env.DATABASE_URL) {
  console.warn('⚠️ Warning: DATABASE_URL is not set. PostgreSQL connection is disabled until DATABASE_URL is configured.')
}

let pool

if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  })

  pool.connect((err, client, release) => {
    if (err) {
      console.error('DB Connection Error:', err)
      if (err.stack) console.error(err.stack)
    } else {
      console.log('✅ PostgreSQL Connected!')
      release()
    }
  })
} else {
  pool = {
    query: async () => {
      throw new Error('DATABASE_URL is not configured. Please set DATABASE_URL in backend/.env to enable PostgreSQL.')
    },
    connect: async () => {
      throw new Error('DATABASE_URL is not configured. Please set DATABASE_URL in backend/.env to enable PostgreSQL.')
    }
  }
}

module.exports = pool
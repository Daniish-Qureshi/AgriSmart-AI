const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

pool.connect((err, client, release) => {
  if (err) {
    console.error('DB Connection Error:', err.message)
  } else {
    console.log('✅ PostgreSQL Connected!')
    release()
  }
})

module.exports = pool
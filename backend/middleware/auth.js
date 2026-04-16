const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET || 'agri-smart-dev-secret'

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Access denied' })
  try {
    const decoded = jwt.verify(token, jwtSecret)
    req.user = decoded
    next()
  } catch {
    res.status(401).json({ message: 'Invalid token' })
  }
}
const express = require('express')
const router = express.Router()
const { saveSimulation, getSimulations } = require('../controllers/simulationController')
const { saveSoilRecord, getSoilRecords } = require('../controllers/soilController')
const { saveQuestion, getQuestions } = require('../controllers/forumController')
const { chatWithAI } = require('../controllers/aiController')
const auth = require('../middleware/auth')

// Protect all routes with auth middleware
router.post('/simulation', auth, saveSimulation)
router.get('/simulation', auth, getSimulations)

router.post('/soil', auth, saveSoilRecord)
router.get('/soil', auth, getSoilRecords)

router.post('/forum', auth, saveQuestion)
router.get('/forum', auth, getQuestions)

router.post('/ai/chat', auth, chatWithAI)

module.exports = router

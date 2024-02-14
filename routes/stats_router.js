const express = require('express')
const router = express.Router()
const Stats = require('../models/stats')

router.get('/api/stats', (req, res) => {
    Stats.fetchOwnersAndStations()
        .then(data => res.json(data))
})

module.exports = router
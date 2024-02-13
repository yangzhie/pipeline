const express = require('express')
const router = express.Router()
const Owners = require('../models/owners')

router.get('/api/owners', (req, res) => {
    Owners.findAll()
        .then(owner => res.json(owner))
})

module.exports = router
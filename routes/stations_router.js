const express = require('express')
const router = express.Router()
const Stations = require('../models/stations')

router.get('/api/stations/all', (req, res) => {
    Stations.findAll()
        .then(stations => res.json(stations))
})

router.get('/api/stations/random', (req, res) => {
    Stations.random()
        .then(stations => res.json(stations))
})

router.get('/api/stations/bounds', (req, res) => {
    let minLat = req.query.minLat
    let maxLat = req.query.maxLat
    let minLng = req.query.minLng
    let maxLng = req.query.maxLng
    let coordinates = [minLat, maxLat, minLng, maxLng]
    Stations.findStationsInBound(coordinates)
        .then(stations => res.json(stations))
})

router.get('/api/stations/nearest', (req, res) => {
    let lat = req.query.lat
    let lng = req.query.lng
    let radius = req.query.radius
    console.log(lat, lng, radius);
    Stations.findNearestStations(lat, lng, radius)
        .then(stations => res.json(stations))

})

module.exports = router
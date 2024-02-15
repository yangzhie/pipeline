const db = require('../db/index')

function findAll() {
    const sql =
        `SELECT * FROM stations
        LIMIT 400;`

    return db.query(sql)
        .then(result => result.rows)
}

function random() {
    const sql =
        `SELECT * FROM stations 
        ORDER BY RANDOM()
        LIMIT 1;`

    return db.query(sql)
        .then(result => result.rows[0])
}

function findStationsInBound(boundsCoordinates) {

    let minLat = boundsCoordinates[0]
    let maxLat = boundsCoordinates[1]
    let minLng = boundsCoordinates[2]
    let maxLng = boundsCoordinates[3]

    const sql =
        `SELECT * FROM stations
        WHERE (latitude BETWEEN $1 AND $2)
        AND (longitude BETWEEN $3 AND $4);`

    return db.query(sql, [minLat, maxLat, minLng, maxLng])
        .then(result => result.rows)
}

function findNearestStations(lat, lng, radius) {

    const sql =
        `SELECT *,
    (select SQRT(POW(69.1 * (latitude::float - $1::float), 2) + 
        POW(69.1 * (longitude::float - $2::float) * COS(latitude::float / 57.3), 2)
    )) AS Distance
    FROM stations
    ORDER BY Distance
    LIMIT 700;`

    return db.query(sql, [lat, lng])
        .then(result => result.rows)


}

module.exports = {
    findAll,
    random,
    findStationsInBound,
    findNearestStations
}
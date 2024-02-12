const db = require('../db/index')

function findAll() {
    const sql =
        `SELECT * FROM stations
        LIMIT 400;`

    return db.query(sql)
        .then(result => result.rows)
}

module.exports = {
    findAll
}
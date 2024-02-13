const db = require('../db/index')

function findAll() {
    const sql =
        `SELECT DISTINCT OWNER FROM stations;`

    return db.query(sql)
        .then(result => result.rows)
}

module.exports = {
    findAll
}
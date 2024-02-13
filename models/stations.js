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
        TABLESAMPLE SYSTEM (1) 
        LIMIT 1;`

    return db.query(sql)
        .then(result => result.rows[0])
}

module.exports = {
    findAll,
    random
}
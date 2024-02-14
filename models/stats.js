const db = require('../db/index')

const sql1 = `
    SELECT owner, COUNT(owner) AS total 
    FROM stations
    GROUP BY owner
    HAVING COUNT(owner) > 1
    ORDER BY total DESC;
`
const sql2 = `
SELECT COUNT(DISTINCT(owner)) AS total_owners 
FROM stations;
`

const sql3 = `
SELECT COUNT(owner) AS total_stations 
FROM stations;
`
async function fetchOwnersAndStations() {
    const result1 = await db.query(sql1);
    const result2 = await db.query(sql2);
    const result3 = await db.query(sql3);
// promise.all?
    const owners = result1.rows;
    const totalOwners = result2.rows[0];
    const totalStations = result3.rows[0];

    const data = {
        owners: owners,
        totalOwners: totalOwners,
        totalStations: totalStations
    };
    return data
}

// fetchOwnersAndStations();

module.exports = {
    fetchOwnersAndStations
}

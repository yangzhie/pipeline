require('dotenv').config()
const express = require('express')
const app = express()
const port = 8080

app.use(express.json())
app.use(express.static('client'))

app.get('/test', (req, res) => {
    res.send("TESTING")
})

app.listen(port, () => {
    console.log(`The server is now listening on ${port}`);
})

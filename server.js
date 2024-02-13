require('dotenv').config()

const express = require('express')
const app = express()
const port = 8080

// requiring routers
const homeRouter = require('./routes/home_router')
const ownersRouter = require('./routes/owners_router')
const stationsRouter = require('./routes/stations_router')

// converting to JS from JSON
app.use(express.json())
app.use(express.static('client'))

// ejs
app.set('view engine', 'ejs')

// routers
app.use(homeRouter)
app.use(ownersRouter)
app.use(stationsRouter)

// listening port
app.listen(port, () => {
    console.log(`The server is now listening on ${port}`);
})

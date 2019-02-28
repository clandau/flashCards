const express = require('express')
const app = express()
const path = require('path')
const router = express.Router()

const mysql = require('mysql')

const config = require('./config')
const dbOptions = {
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    port: config.database.port,
    database: config.database.database,
    multipleStatements: config.database.multipleStatements
}

const connection = mysql.createConnection(dbOptions)
connection.connect((err) => {
    if(err) {
        console.err(`error connecting to database: ${err.stack}`)
    }
    else console.log(`connected to database`)
})

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/views/index.html'))
})

app.get('/random', (req, res) => {
    //get a random card from the database and send the json response
    
})

const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
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
// app.use(myConnection(mysql, dbOptions, 'request'))
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/views/index.html'))
})

app.get('/random', (req, res) => {
    let category = req.query.category
    if(category) {
        connection.query('SELECT sideA, sideB FROM card WHERE category=? ORDER BY RAND() LIMIT 1', [category],(err, rows) => {
            if(err) res.send(err)
            res.send(rows)
        })
    }
    else {
        connection.query('SELECT sideA, sideB FROM card ORDER BY RAND() LIMIT 1', (err, rows) => {
            if(err) res.send(err)
            res.send(rows)
        })
    }
})

const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
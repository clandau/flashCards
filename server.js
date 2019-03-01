const express = require('express')
const app = express()
const path = require('path')
// const router = express.Router()
const config = require('./config')

const mysql = require('mysql'),
      myConnection = require('express-myconnection'),
      dbOptions = {
        host: config.database.host,
        user: config.database.user,
        password: config.database.password,
        port: config.database.port,
        database: config.database.database,
        multipleStatements: config.database.multipleStatements
      }

app.use(myConnection(mysql, dbOptions, 'request'))

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/views/index.html'))
})

app.get('/random', (req, res) => {
    let category = req.query.category
    let sql
    if(!category) {
        sql = 'SELECT sideA, sideB FROM card ORDER BY RAND() LIMIT 1'
    }
    else {
        sql = 'SELECT sideA, sideB FROM card WHERE category=? ORDER BY RAND() LIMIT 1'
    }
    req.getConnection((err, conn) => {
        if(err) res.send(err)
        conn.query(sql, [category], (err, rows) => {
            if(err) res.send(err)
            else { 
                res.send(rows)
            }
        })
    })
})

// app.post('/')

const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
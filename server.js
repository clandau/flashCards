const express = require('express')
const app = express()
const path = require('path')
const config = require('./config')
const bodyParser = require('body-parser')

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
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

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

app.post('/new', (req, res) => {
    console.log(req.body)
    if(!req.body) {
        res.status(400).send('Request body missing')
    }
    if(!req.body.sideA) res.send(`No text entered.`)
    else {
        let sql = `INSERT INTO card set ?`
        let data = JSON.parse(JSON.stringify(req.body))
        req.getConnection((err, conn) => {
            if(err) res.send(err)
            conn.query(sql, [data], (err, rows, fields) => {
                if(err) res.send(err)
                else {
                    res.send(rows)
                }
            })
        })
    }
})

const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
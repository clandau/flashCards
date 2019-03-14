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
app.set('view engine', 'pug')

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/views/index.html'))
})

app.get('/random', (req, res) => {
    let category = req.query.category
    let sql
    if(!category) {
        sql = 'SELECT category, sideA, sideB FROM card ORDER BY RAND() LIMIT 1'
    }
    else {
        sql = 'SELECT category, sideA, sideB FROM card WHERE category=? ORDER BY RAND() LIMIT 1'
    }
    req.getConnection((err, conn) => {
        if(err) res.send(err)
        conn.query(sql, [category], (err, rows) => {
            if(err) res.send(err)
            else {          
                res.render('card', { 'cardData' : rows })
            }
        })
    })
})

app.get('/all', (req, res) => {
    const sql = 'SELECT * FROM card ORDER BY category'
    req.getConnection((err, conn) => {
        if(err) res.send(err)
        conn.query(sql, (err, rows) => {
            if(err) res.send(err)
            res.status(200).json(rows)
        })
    })
})

app.post('/new', (req, res) => {
    if(!req.body) {
        res.render('400', { 'err': 'Request body missing.'})
    }
    if(!req.body.sideA) res.render('400', { 'err': 'No text entered.'})
    else {
        let sql = `INSERT INTO card set ?`
        let data = JSON.parse(JSON.stringify(req.body))
        req.getConnection((err, conn) => {
            if(err) res.send(err)
            conn.query(sql, [data], (err, rows) => {
                if(err) res.send(err)
                else {
                    res.send(`sucessfully added to database. ${data}`)
                }
            })
        })
    }
})

const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
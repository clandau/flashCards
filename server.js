const express = require('express')
const app = express()
const path = require('path')
const router = express.Router()

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/views/index.html'))
})

const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
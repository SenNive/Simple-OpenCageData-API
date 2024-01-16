const express = require('express')
const swaggerUi = require('swagger-ui-express')
const yaml = require('js-yaml')
const fs = require('fs')

const rateLimit = require('express-rate-limit')

const adminHandler = require('./handlers/adminHandler') // Mengimpor handler untuk admin endpoint
const mapHandler = require('./handlers/mapHandler') // Mengimpor handler untuk map service

const swaggerDocument = yaml.load(fs.readFileSync('./docs/swagger.yaml', 'utf8'))

const app = express()

// Middleware untuk mengatur batas permintaan
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 menit
  max: 30 // Maksimal 5 permintaan dalam 1 menit
})

// app.use(limiter)
app.use(express.json())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Menghubungkan handler untuk endpoint admin
adminHandler(app)

// Menghubungkan handler untuk endpoint map service
mapHandler(app)

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server berjalan http://localhost:${port}/api-docs`)
})

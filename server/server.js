require('dotenv').config()

const cors = require('cors')
const express = require('express')
const fs = require('fs')
const path = require('path')
const buyersRouter = require('./routes/buyers')
const emailRouter = require('./routes/email')

const app = express()
const port = Number(process.env.PORT) || 5000
const clientDist = path.resolve(__dirname, '../client/dist')
const clientIndex = path.join(clientDist, 'index.html')

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
	.split(',')
	.map((origin) => origin.trim())

app.use(cors({
	origin(origin, callback) {
		if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
		return callback(new Error('Origin is not allowed by CORS.'))
	},
}))
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_request, response) => {
	response.json({ status: 'ok', service: 'HomeDecor Buyer Finder API' })
})

app.use('/api/buyers', buyersRouter)
app.use('/api/email', emailRouter)
app.use('/api', (_request, response) => {
	response.status(404).json({ success: false, message: 'API endpoint not found.' })
})

app.use(express.static(clientDist))

app.get('/{*splat}', (request, response, next) => {
	if (request.path.split('/').pop().includes('.')) return next()
	if (!fs.existsSync(clientIndex)) {
		return response.status(503).send('Frontend build not found. Run the client production build first.')
	}
	return response.sendFile(clientIndex, (error) => error && next(error))
})

app.use((error, _request, response, _next) => {
	console.error('Unhandled API error:', error.message)
	response.status(500).json({ success: false, message: 'An unexpected server error occurred.' })
})

app.listen(port, '0.0.0.0', () => {
	console.log(`HomeDecor Buyer Finder API listening on port ${port}`)
})

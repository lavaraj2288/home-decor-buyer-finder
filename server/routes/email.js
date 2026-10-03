const express = require('express')
const { sendEmail } = require('../services/emailService')

const router = express.Router()

router.post('/send', async (request, response) => {
	const { to, subject, message } = request.body || {}
	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

	if (typeof to !== 'string' || !emailPattern.test(to.trim())) {
		return response.status(400).json({ success: false, message: 'Enter a valid recipient email address.' })
	}
	if (typeof subject !== 'string' || !subject.trim()) {
		return response.status(400).json({ success: false, message: 'Email subject is required.' })
	}
	if (typeof message !== 'string' || !message.trim()) {
		return response.status(400).json({ success: false, message: 'Email message is required.' })
	}

	try {
		const result = await sendEmail({ to: to.trim(), subject: subject.trim(), message: message.trim() })
		return response.json({ success: true, message: result.message || 'Email sent successfully' })
	} catch (error) {
		return response.status(error.status || 502).json({ success: false, message: error.message || 'Email could not be sent.' })
	}
})

module.exports = router

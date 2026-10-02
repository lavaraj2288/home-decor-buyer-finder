const { Resend } = require('resend')

async function sendEmail({ to, subject, message }) {
	try {
		const resend = new Resend(process.env.RESEND_API_KEY)
		const { error } = await resend.emails.send({
			from: process.env.RESEND_FROM_EMAIL,
			to: [to],
			subject,
			text: message,
		})
		if (error) throw new Error(error.message || 'Resend could not send the email.')
	} catch (error) {
		const messageText = /api key|unauthorized|forbidden/i.test(error.message)
			? 'Resend rejected the API key. Check the key and sender configuration.'
			: error.message || 'Resend could not send the email.'
		const serviceError = new Error(messageText)
		serviceError.status = 502
		throw serviceError
	}
}

module.exports = { sendEmail }

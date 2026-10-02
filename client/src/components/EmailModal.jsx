import { useState } from 'react'
import axios from 'axios'
import { Check, LoaderCircle, Mail, X } from 'lucide-react'

const defaultMessage = `Hello,\n\nI am reaching out regarding a potential partnership opportunity for home decor products.\n\nWe believe our products could be a good fit for your business and would be happy to share our catalog and discuss potential collaboration.\n\nPlease let me know if you would be interested in learning more.\n\nBest regards,\n[Seller Name]`


function EmailModal({ buyer, onClose, onSuccess }) {
	const [to, setTo] = useState(buyer.email || '')
	const [subject, setSubject] = useState('Home Decor Partnership Opportunity')
	const [message, setMessage] = useState(defaultMessage)
	const [isSending, setIsSending] = useState(false)
	const [error, setError] = useState('')
	const [sent, setSent] = useState(false)

	async function submit(event) {
		event.preventDefault()
		setIsSending(true)
		setError('')
		try {
			const { data } = await axios.post('/api/email/send', { to, subject, message }, { timeout: 20000 })
			setSent(true)
			onSuccess(data.message || 'Email sent successfully')
		} catch (requestError) {
			setError(requestError.response?.data?.message || requestError.response?.data?.error || 'The email could not be sent. Check your connection and try again.')
		} finally {
			setIsSending(false)
		}
	}

	return (
		<div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
			<section className="email-modal" role="dialog" aria-modal="true" aria-labelledby="email-title">
				<div className="modal-header"><div className="modal-icon"><Mail size={19} /></div><div><div className="section-kicker">PERSONALIZED OUTREACH</div><h2 id="email-title">Write your introduction</h2></div><button type="button" className="icon-button modal-close" onClick={onClose} aria-label="Close"><X size={19} /></button></div>
				{sent ? <div className="sent-state"><span><Check size={25} /></span><h3>Email sent successfully</h3><p>Your message to {buyer.name} is on its way.</p><button type="button" className="modal-submit" onClick={onClose}>Done</button></div> : <form onSubmit={submit}>
					<label className="modal-field"><span>To</span><input type="email" required value={to} onChange={(event) => setTo(event.target.value)} autoComplete="email" /></label>
					<label className="modal-field"><span>Subject</span><input required value={subject} onChange={(event) => setSubject(event.target.value)} /></label>
					<label className="modal-field"><span>Message</span><textarea required rows="9" value={message} onChange={(event) => setMessage(event.target.value)} /></label>
					{error && <div className="modal-error" role="alert">{error}</div>}
					<div className="modal-footer"><span>Sent via your verified Resend sender</span><button className="modal-submit" type="submit" disabled={isSending}>{isSending ? <><LoaderCircle className="spin-icon" size={16} />Sending...</> : <><Mail size={16} />Send Email</>}</button></div>
				</form>}
			</section>
		</div>
	)
}

export default EmailModal

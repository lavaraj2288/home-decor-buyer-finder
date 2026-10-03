import { useState } from 'react'
import axios from 'axios'
import { CheckCircle2, FileText, Loader2, Mail, Send, Sparkles, X } from 'lucide-react'

const OUTREACH_TEMPLATES = [
	{
		id: 'wholesale',
		name: 'Wholesale Catalog',
		subject: (buyer) => `Wholesale Partnership Inquiry — ${buyer.name}`,
		message: (buyer) => `Hello ${buyer.name} Team,\n\nI came across your work in home decor and interior styling, and I am reaching out regarding a potential B2B wholesale partnership.\n\nWe manufacture handcrafted, premium home decor pieces (lighting, wall decor, and artisan furnishings) that align beautifully with your aesthetic.\n\nWould you be open to reviewing our 2026 Trade Catalog and wholesale pricing tiers?\n\nWarm regards,\nPartnership Director\nHome Decor Studio`,
	},
	{
		id: 'trade',
		name: 'Exclusive Trade Discount',
		subject: (buyer) => `Exclusive Trade Program for ${buyer.name}`,
		message: (buyer) => `Dear ${buyer.name} Procurement Team,\n\nWe would love to extend an invitation to our Exclusive Trade & Interior Designer Program.\n\nAs a verified member, you receive:\n• Up to 40% trade discount on all custom orders\n• Complimentary finish & material swatch samples\n• Priority manufacturing & dedicated account support\n\nPlease let us know if you would like your account activated.\n\nBest regards,\nTrade Relations\nHome Decor Studio`,
	},
	{
		id: 'collab',
		name: 'Custom Collaboration',
		subject: (buyer) => `Custom Project Collaboration with ${buyer.name}`,
		message: (buyer) => `Hi ${buyer.name} Team,\n\nWe love your recent projects and design portfolio. We specialize in custom-crafted architectural home decor and sculptural accents for high-end residential and commercial spaces.\n\nIf you have any upcoming interior projects needing bespoke furnishings or decor accents, we would love to collaborate.\n\nLooking forward to connecting,\nDesign Lead\nHome Decor Studio`,
	},
]

function EmailModal({ buyer, onClose, onSuccess }) {
	const [activeTemplate, setActiveTemplate] = useState('wholesale')
	const [to, setTo] = useState(buyer.email || '')
	const [subject, setSubject] = useState(OUTREACH_TEMPLATES[0].subject(buyer))
	const [message, setMessage] = useState(OUTREACH_TEMPLATES[0].message(buyer))
	const [isSending, setIsSending] = useState(false)
	const [error, setError] = useState('')
	const [sent, setSent] = useState(false)

	function switchTemplate(templateId) {
		const tmpl = OUTREACH_TEMPLATES.find((t) => t.id === templateId)
		if (tmpl) {
			setActiveTemplate(templateId)
			setSubject(tmpl.subject(buyer))
			setMessage(tmpl.message(buyer))
		}
	}

	async function submit(event) {
		event.preventDefault()
		setIsSending(true)
		setError('')
		try {
			const { data } = await axios.post('/api/email/send', { to, subject, message }, { timeout: 20000 })
			setSent(true)
			onSuccess(data.message || `Outreach successfully delivered to ${to}`)
		} catch (requestError) {
			setError(
				requestError.response?.data?.message ||
				requestError.response?.data?.error ||
				'The email could not be delivered. Check your connection and try again.'
			)
		} finally {
			setIsSending(false)
		}
	}

	return (
		<div className="modal-backdrop-luxury" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
			<section className="email-modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
				{/* Modal Top Bar */}
				<div className="modal-top-bar">
					<div className="modal-top-left">
						<div className="modal-icon-badge">
							<Mail size={18} />
						</div>
						<div>
							<span className="modal-kicker">PERSONALIZED B2B OUTREACH</span>
							<h2 id="modal-headline" className="modal-heading">Contact {buyer.name}</h2>
						</div>
					</div>
					<button type="button" className="modal-close-button" onClick={onClose} aria-label="Close modal">
						<X size={18} />
					</button>
				</div>

				{sent ? (
					<div className="modal-success-screen">
						<div className="success-icon-wrap">
							<CheckCircle2 size={36} />
						</div>
						<h3>Outreach Dispatched!</h3>
						<p>Your personalized pitch to <strong>{buyer.name}</strong> ({to}) has been transmitted via the delivery pipeline.</p>
						<div className="success-actions">
							<button type="button" className="btn-done" onClick={onClose}>
								Close & Continue Search
							</button>
						</div>
					</div>
				) : (
					<div className="modal-body-content">
						{/* Template Picker */}
						<div className="template-picker-bar">
							<span className="template-label">
								<Sparkles size={13} />
								<span>Outreach Template:</span>
							</span>
							<div className="template-pills">
								{OUTREACH_TEMPLATES.map((tmpl) => (
									<button
										key={tmpl.id}
										type="button"
										className={`template-pill ${activeTemplate === tmpl.id ? 'active' : ''}`}
										onClick={() => switchTemplate(tmpl.id)}
									>
										<FileText size={12} />
										<span>{tmpl.name}</span>
									</button>
								))}
							</div>
						</div>

						<form onSubmit={submit} className="outreach-form">
							<div className="form-field">
								<label htmlFor="outreach-to">Recipient Email (Verified)</label>
								<div className="input-field-wrap">
									<Mail size={15} className="field-icon" />
									<input
										id="outreach-to"
										type="email"
										required
										value={to}
										onChange={(e) => setTo(e.target.value)}
										autoComplete="email"
									/>
								</div>
							</div>

							<div className="form-field">
								<label htmlFor="outreach-subject">Email Subject</label>
								<input
									id="outreach-subject"
									required
									value={subject}
									onChange={(e) => setSubject(e.target.value)}
								/>
							</div>

							<div className="form-field">
								<label htmlFor="outreach-message">Pitch Message</label>
								<textarea
									id="outreach-message"
									required
									rows={8}
									value={message}
									onChange={(e) => setMessage(e.target.value)}
								/>
							</div>

							{error && (
								<div className="form-error-banner" role="alert">
									<span>{error}</span>
								</div>
							)}

							<div className="modal-bottom-bar">
								<div className="delivery-note">
									<span className="delivery-pulse" />
									<span>Dispatched via verified Resend outreach relay</span>
								</div>
								<div className="modal-buttons">
									<button type="button" className="btn-cancel" onClick={onClose}>
										Cancel
									</button>
									<button type="submit" className="btn-send-outreach" disabled={isSending}>
										{isSending ? (
											<>
												<Loader2 size={15} className="animate-spin" />
												<span>Transmitting...</span>
											</>
										) : (
											<>
												<Send size={15} />
												<span>Send Email Outreach</span>
											</>
										)}
									</button>
								</div>
							</div>
						</form>
					</div>
				)}
			</section>
		</div>
	)
}

export default EmailModal

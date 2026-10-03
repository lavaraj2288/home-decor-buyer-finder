import { useState } from 'react'
import { ArrowUpRight, Check, Copy, ExternalLink, Globe2, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react'

function BuyerCard({ buyer, onSendEmail }) {
	const [copied, setCopied] = useState(false)
	const location = [buyer.city, buyer.state, buyer.country].filter(Boolean).join(', ')

	// Normalize website URL to ensure it starts with https://
	const cleanUrl = buyer.website
		? (buyer.website.startsWith('http://') || buyer.website.startsWith('https://')
			? buyer.website
			: `https://${buyer.website}`)
		: ''

	// Display hostname
	const displayDomain = cleanUrl
		? cleanUrl.replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/.*$/, '')
		: ''

	// Generate initial monogram
	const initials = (buyer.name || 'HD')
		.split(' ')
		.filter(Boolean)
		.slice(0, 2)
		.map((w) => w[0].toUpperCase())
		.join('')

	function copyEmail(e) {
		e.stopPropagation()
		if (buyer.email) {
			navigator.clipboard.writeText(buyer.email)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		}
	}

	function handleOpenWebsite(e) {
		if (cleanUrl) {
			window.open(cleanUrl, '_blank', 'noopener,noreferrer')
		}
	}

	return (
		<article className="premium-buyer-card">
			{/* Header area with monogram and verified badge */}
			<div className="card-top-bar">
				<div className="avatar-monogram">
					<span>{initials}</span>
				</div>
				<div className="card-top-meta">
					<span className="buyer-category-tag">{buyer.type}</span>
					<div className={`verified-email-badge ${buyer.email ? 'verified' : 'unverified'}`}>
						<ShieldCheck size={13} />
						<span>{buyer.email ? 'Professional Email' : 'Public Phone / Map'}</span>
					</div>
				</div>
			</div>

			{/* Business Title & Location */}
			<div className="card-main-info">
				<h3 className="business-name" title={buyer.name}>{buyer.name}</h3>
				{location && (
					<div className="business-location">
						<MapPin size={13} />
						<span>{location}</span>
					</div>
				)}
			</div>

			{/* Contact & Verification Grid */}
			<div className="business-credentials">
				{buyer.email && (
					<div className="credential-row email-row">
						<Mail size={14} className="credential-icon" />
						<a href={`mailto:${buyer.email}`} className="credential-value email-link" title={buyer.email}>
							{buyer.email}
						</a>
						<button
							type="button"
							className="copy-button"
							onClick={copyEmail}
							title="Copy email to clipboard"
							aria-label="Copy email"
						>
							{copied ? <Check size={12} className="copied-icon" /> : <Copy size={12} />}
						</button>
					</div>
				)}

				{buyer.emailSource && (
					<div className="source-row">
						<span className="source-label">Enrichment:</span>
						<span className="source-val">{buyer.emailSource}</span>
					</div>
				)}

				{buyer.phone && (
					<div className="credential-row">
						<Phone size={14} className="credential-icon" />
						<a href={`tel:${buyer.phone}`} className="credential-value">
							{buyer.phone}
						</a>
					</div>
				)}

				{cleanUrl && (
					<div className="credential-row">
						<Globe2 size={14} className="credential-icon" />
						<a
							href={cleanUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="credential-value website-link"
							onClick={handleOpenWebsite}
							title={`Visit ${displayDomain}`}
						>
							<span>{displayDomain}</span>
							<ExternalLink size={11} />
						</a>
					</div>
				)}

				{buyer.address && (
					<div className="address-snippet" title={buyer.address}>
						{buyer.address}
					</div>
				)}
			</div>

			{/* Card Action Footer */}
			<div className="card-action-bar">
				<button
					className="action-outreach-btn"
					type="button"
					disabled={!buyer.email}
					onClick={() => onSendEmail(buyer)}
				>
					<Mail size={14} />
					<span>Send Outreach</span>
				</button>

				{cleanUrl && (
					<a
						className="action-secondary-btn"
						href={cleanUrl}
						target="_blank"
						rel="noopener noreferrer"
						onClick={handleOpenWebsite}
						title={`Open official website: ${cleanUrl}`}
					>
						<span>Website</span>
						<ArrowUpRight size={13} />
					</a>
				)}

				{buyer.mapsUrl && (
					<a
						className="action-map-btn"
						href={buyer.mapsUrl}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={`Open ${buyer.name} on Google Maps`}
						title="Open Google Maps location"
					>
						<MapPin size={14} />
					</a>
				)}
			</div>
		</article>
	)
}

export default BuyerCard

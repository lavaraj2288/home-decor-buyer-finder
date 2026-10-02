import { ArrowUpRight, Globe2, Mail, MapPin, Phone } from 'lucide-react'

function BuyerCard({ buyer, onSendEmail }) {
	const location = [buyer.city, buyer.state, buyer.country].filter(Boolean).join(', ')

	return (
		<article className="buyer-card">
			<div className="buyer-card-top"><span className="buyer-type">{buyer.type}</span><span className={`email-indicator ${buyer.email ? 'email-found' : 'email-missing'}`}><span />{buyer.email ? 'Professional email found' : 'No public professional email found'}</span></div>
			<h3>{buyer.name}</h3>
			{location && <p className="buyer-location"><MapPin size={14} />{location}</p>}
			<div className="buyer-details">
				{buyer.email && <div className="detail-row"><Mail size={15} /><a href={`mailto:${buyer.email}`}>{buyer.email}</a></div>}
				{buyer.email && buyer.emailSource && <div className="detail-row email-source">Email source: {buyer.emailSource}</div>}
				{buyer.phone && <div className="detail-row"><Phone size={15} /><a href={`tel:${buyer.phone}`}>{buyer.phone}</a></div>}
				{buyer.website && <div className="detail-row"><Globe2 size={15} /><a href={buyer.website} target="_blank" rel="noreferrer">{buyer.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}<ArrowUpRight size={12} /></a></div>}
				{buyer.address && <div className="buyer-address">{buyer.address}</div>}
			</div>
			<div className="buyer-card-actions">
				<button className="card-email-button" type="button" disabled={!buyer.email} onClick={() => onSendEmail(buyer)}><Mail size={15} />Send Email</button>
				{buyer.website && <a className="card-visit-button" href={buyer.website} target="_blank" rel="noreferrer">Visit website <ArrowUpRight size={14} /></a>}
				{buyer.mapsUrl && <a className="maps-link" href={buyer.mapsUrl} target="_blank" rel="noreferrer" aria-label={`Open ${buyer.name} in Google Maps`}><MapPin size={15} /></a>}
			</div>
		</article>
	)
}

export default BuyerCard

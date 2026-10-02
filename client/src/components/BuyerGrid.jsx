import BuyerCard from './BuyerCard.jsx'

function BuyerGrid({ buyers, onSendEmail }) {
	return <div className="buyer-grid">{buyers.map((buyer, index) => <BuyerCard key={buyer.id || `${buyer.name}-${index}`} buyer={buyer} onSendEmail={onSendEmail} />)}</div>
}

export default BuyerGrid

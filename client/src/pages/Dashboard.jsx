import { useEffect, useState } from 'react'
import axios from 'axios'
import { AlertCircle, ArrowUpRight, Search, Sparkles } from 'lucide-react'
import BuyerGrid from '../components/BuyerGrid.jsx'
import EmailModal from '../components/EmailModal.jsx'
import Navbar from '../components/Navbar.jsx'
import SearchForm from '../components/SearchForm.jsx'

function Dashboard() {
	const [backendStatus, setBackendStatus] = useState('checking')
	const [buyers, setBuyers] = useState([])
	const [hasSearched, setHasSearched] = useState(false)
	const [isSearching, setIsSearching] = useState(false)
	const [error, setError] = useState('')
	const [selectedBuyer, setSelectedBuyer] = useState(null)
	const [toast, setToast] = useState('')

	useEffect(() => {
		let active = true
		axios.get('/api/health', { timeout: 5000 })
			.then(() => active && setBackendStatus('connected'))
			.catch(() => active && setBackendStatus('offline'))
		return () => { active = false }
	}, [])

	useEffect(() => {
		if (!toast) return undefined
		const timer = window.setTimeout(() => setToast(''), 4500)
		return () => window.clearTimeout(timer)
	}, [toast])

	async function handleSearch(criteria) {
		setIsSearching(true)
		setHasSearched(true)
		setError('')
		setBuyers([])
		try {
			const { data } = await axios.get('/api/buyers', { params: criteria, timeout: 60000 })
			setBuyers(data.buyers || [])
		} catch (requestError) {
			setError(requestError.response?.data?.error || 'The buyer search could not reach the backend. Check that the server is running.')
		} finally {
			setIsSearching(false)
		}
	}

	return (
		<div className="app-shell" id="dashboard">
			<Navbar backendStatus={backendStatus} />
			<main>
				<section className="hero-section">
					<div className="hero-copy">
						<div className="eyebrow"><Sparkles size={14} /> REAL-TIME B2B DISCOVERY</div>
						<h1>Find Your Next<br /><span>Home Decor Buyers</span></h1>
						<p>Discover potential retailers, interior designers, furniture stores and home furnishing businesses across the United States.</p>
						<div className="hero-meta"><span className="meta-dot" /> Live business data <span className="meta-divider" /> Built for independent brands</div>
					</div>
					<div className="hero-art" aria-hidden="true">
						<div className="art-grid" />
						<div className="art-sun" />
						<div className="art-arch"><div className="art-vase" /><div className="art-stem stem-one" /><div className="art-stem stem-two" /></div>
						<div className="art-label"><span className="label-mark"><ArrowUpRight size={15} /></span><span>Made for meaningful<br />partnerships</span></div>
						<span className="art-index">01 / DISCOVER</span>
					</div>
				</section>

				<section className="search-section" id="find-buyers">
					<div className="section-heading">
						<div><div className="section-kicker">YOUR NEXT CUSTOMER IS OUT THERE</div><h2>Build your buyer list</h2></div>
						<div className="section-note"><span className="note-icon"><Search size={15} /></span> Search verified business listings</div>
					</div>
					<SearchForm onSearch={handleSearch} isSearching={isSearching} />
				</section>

				<section className="results-section" id="buyers">
					<div className="results-heading">
						<div><div className="section-kicker">US BUSINESS DIRECTORY</div><h2>{hasSearched ? 'Potential buyers' : 'Your search results'}</h2></div>
						{hasSearched && !isSearching && !error && <span className="result-count">{buyers.length} {buyers.length === 1 ? 'potential buyer' : 'potential buyers'} found</span>}
					</div>

					{isSearching && <div className="state-panel loading-panel"><span className="spinner" /><div><strong>Finding potential buyers...</strong><span>Searching business listings and checking public email sources.</span></div></div>}
					{!isSearching && error && <div className="state-panel error-panel"><AlertCircle size={20} /><div><strong>Search unavailable</strong><span>{error}</span></div></div>}
					{!isSearching && !error && hasSearched && buyers.length === 0 && <div className="state-panel empty-panel"><div className="empty-mark"><Search size={21} /></div><strong>No potential buyers found.</strong><span>Try changing your buyer type or search keywords.</span></div>}
					{!isSearching && !error && !hasSearched && <div className="state-panel idle-panel"><span className="idle-icon"><Search size={20} /></span><div><strong>Start with a category that fits your collection.</strong><span>Business listings and publicly available contacts appear here after your search.</span></div></div>}
					{!isSearching && !error && buyers.length > 0 && <BuyerGrid buyers={buyers} onSendEmail={setSelectedBuyer} />}
				</section>
			</main>
			<footer className="site-footer"><span>HomeDecor Buyer Finder</span><span>Thoughtful products deserve the right partners.</span></footer>
			{selectedBuyer && <EmailModal buyer={selectedBuyer} onClose={() => setSelectedBuyer(null)} onSuccess={(message) => setToast(message)} />}
			{toast && <div className="toast-message" role="status"><span className="toast-check">✓</span>{toast}</div>}
		</div>
	)
}

export default Dashboard

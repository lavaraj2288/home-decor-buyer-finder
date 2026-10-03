import { useEffect, useState } from 'react'
import axios from 'axios'
import {
	AlertCircle,
	ArrowRight,
	CheckCircle2,
	Database,
	Globe,
	Mail,
	MapPin,
	Search,
	ShieldCheck,
	Sparkles,
	TrendingUp,
	Users
} from 'lucide-react'
import BuyerGrid from '../components/BuyerGrid.jsx'
import EmailModal from '../components/EmailModal.jsx'
import Navbar from '../components/Navbar.jsx'
import SearchForm from '../components/SearchForm.jsx'
import heroDecorImg from '../assets/hero-decor.jpg'

function Dashboard() {
	const [backendStatus, setBackendStatus] = useState('checking')
	const [buyers, setBuyers] = useState([])
	const [hasSearched, setHasSearched] = useState(false)
	const [isSearching, setIsSearching] = useState(false)
	const [currentQuery, setCurrentQuery] = useState(null)
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
		setCurrentQuery(criteria)
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
		<div className="luxury-app-shell" id="dashboard">
			<Navbar backendStatus={backendStatus} />

			<main>
				{/* Editorial Hero Section */}
				<section className="editorial-hero">
					<div className="hero-grid">
						<div className="hero-text-col">
							<div className="hero-pill-tag">
								<Sparkles size={14} />
								<span>REAL-TIME B2B BUYER INTELLIGENCE</span>
							</div>

							<h1 className="hero-title">
								Discover & Contact <br />
								<span className="hero-accent">US Home Decor Buyers</span>
							</h1>

							<p className="hero-description">
								Directly reach high-intent interior designers, boutique retail showrooms, and commercial furnishings firms across all 50 states. Powered live by Google Places, Hunter, and Resend APIs — completely dynamic, with zero CSV files.
							</p>

							{/* Key statistics row */}
							<div className="hero-stats-row">
								<div className="stat-card">
									<div className="stat-number">50+</div>
									<div className="stat-label">US States Covered</div>
								</div>
								<div className="stat-divider" />
								<div className="stat-card">
									<div className="stat-number">100%</div>
									<div className="stat-label">Live API Discovery</div>
								</div>
								<div className="stat-divider" />
								<div className="stat-card">
									<div className="stat-number">0</div>
									<div className="stat-label">CSV Files Needed</div>
								</div>
								<div className="stat-divider" />
								<div className="stat-card">
									<div className="stat-number">1-Click</div>
									<div className="stat-label">Outreach Delivery</div>
								</div>
							</div>

							<div className="hero-cta-row">
								<a href="#find-buyers" className="btn-hero-primary">
									<span>Start Buyer Search</span>
									<ArrowRight size={16} />
								</a>
								<a href="#api-suite" className="btn-hero-secondary">
									<span>Explore API Pipeline</span>
								</a>
							</div>
						</div>

						{/* Hero Image Showcase */}
						<div className="hero-visual-col">
							<div className="hero-image-frame">
								<img
									src={heroDecorImg}
									alt="Luxury modern home decor showroom and interior design studio"
									className="hero-main-img"
								/>
								<div className="hero-glass-card">
									<div className="glass-card-header">
										<div className="glass-dot" />
										<span className="glass-title">LIVE RADAR ACTIVE</span>
									</div>
									<p className="glass-body">Interior Design Studios & Home Decor Retailers across US Metropolitan Hubs</p>
									<div className="glass-tags">
										<span className="glass-tag"><MapPin size={11} /> New York, NY</span>
										<span className="glass-tag"><MapPin size={11} /> Los Angeles, CA</span>
										<span className="glass-tag"><ShieldCheck size={11} /> Verified Outreach</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Search Hub Section */}
				<section className="search-hub-section" id="find-buyers">
					<div className="section-header-box">
						<div className="section-kicker-tag">
							<Search size={13} />
							<span>TARGETED B2B SEARCH</span>
						</div>
						<h2 className="section-title">Configure Your Buyer Discovery</h2>
						<p className="section-subtitle">
							Filter by home decor product specialty, buyer organization type, and target US region.
						</p>
					</div>

					<SearchForm onSearch={handleSearch} isSearching={isSearching} />
				</section>

				{/* Results Directory Section */}
				<section className="results-directory-section" id="buyers">
					<div className="results-header-bar">
						<div>
							<div className="section-kicker-tag">
								<Users size={13} />
								<span>US TRADE DIRECTORY</span>
							</div>
							<h2 className="section-title">
								{hasSearched ? 'Identified Trade Buyers' : 'Buyer Discovery Feed'}
							</h2>
						</div>

						{hasSearched && !isSearching && !error && (
							<div className="results-meta-pill">
								<span className="count-number">{buyers.length}</span>
								<span>potential buyers found</span>
								{currentQuery && (
									<span className="query-badge">
										for &ldquo;{currentQuery.keyword}&rdquo; in {currentQuery.location}
									</span>
								)}
							</div>
						)}
					</div>

					{/* Loading State */}
					{isSearching && (
						<div className="modern-state-card state-loading">
							<div className="radar-spinner">
								<div className="radar-circle circle-1" />
								<div className="radar-circle circle-2" />
								<div className="radar-dot" />
							</div>
							<div className="state-text">
								<h3>Scanning US Business Directories...</h3>
								<p>Querying Google Places listings, verifying business websites, and enriching public domain emails via Hunter API.</p>
							</div>
						</div>
					)}

					{/* Error State */}
					{!isSearching && error && (
						<div className="modern-state-card state-error">
							<AlertCircle size={28} className="error-icon" />
							<div className="state-text">
								<h3>Search Interruption</h3>
								<p>{error}</p>
							</div>
						</div>
					)}

					{/* Empty State */}
					{!isSearching && !error && hasSearched && buyers.length === 0 && (
						<div className="modern-state-card state-empty">
							<Search size={32} className="empty-icon" />
							<div className="state-text">
								<h3>No Matching Trade Buyers Found</h3>
								<p>Try broadening your search term or selecting a broader location such as &ldquo;United States&rdquo;.</p>
							</div>
						</div>
					)}

					{/* Idle Initial State */}
					{!isSearching && !error && !hasSearched && (
						<div className="modern-state-card state-idle">
							<div className="idle-radar-icon">
								<Search size={26} />
							</div>
							<div className="state-text">
								<h3>Ready to Discover Qualified US Buyers</h3>
								<p>Select your home decor category above (such as <em>lamps, wall decor, ceramics, or rugs</em>) to fetch live business listings, contact information, and verified email addresses.</p>
							</div>
						</div>
					)}

					{/* Buyer Cards Grid */}
					{!isSearching && !error && buyers.length > 0 && (
						<BuyerGrid buyers={buyers} onSendEmail={setSelectedBuyer} />
					)}
				</section>

				{/* Integrated API Architecture Showcase Section */}
				<section className="api-architecture-section" id="api-suite">
					<div className="section-header-box text-center">
						<div className="section-kicker-tag center-tag">
							<Database size={13} />
							<span>SYSTEM ARCHITECTURE</span>
						</div>
						<h2 className="section-title">Tri-API Integration Pipeline</h2>
						<p className="section-subtitle">
							How DecorPro orchestrates discovery, enrichment, and outreach without static CSV files.
						</p>
					</div>

					<div className="api-cards-grid">
						<div className="api-feature-card">
							<div className="api-card-icon-box google-theme">
								<MapPin size={22} />
							</div>
							<div className="api-card-tag">Discovery Engine</div>
							<h3>Google Places API (New)</h3>
							<p>Dynamically queries real-time commercial business listings across US cities, extracting normalized addresses, phone numbers, and verified website URLs.</p>
							<div className="api-card-footer">
								<CheckCircle2 size={14} />
								<span>Live Text Search &amp; Address Components</span>
							</div>
						</div>

						<div className="api-feature-card">
							<div className="api-card-icon-box hunter-theme">
								<Globe size={22} />
							</div>
							<div className="api-card-tag">Email Enrichment</div>
							<h3>Hunter.io Domain Search</h3>
							<p>Takes each verified business website domain and crawls publicly indexed professional contact emails, returning confidence scores and source attributions.</p>
							<div className="api-card-footer">
								<CheckCircle2 size={14} />
								<span>Domain Search &amp; Confidence Scoring</span>
							</div>
						</div>

						<div className="api-feature-card">
							<div className="api-card-icon-box resend-theme">
								<Mail size={22} />
							</div>
							<div className="api-card-tag">Outreach Delivery</div>
							<h3>Resend Email Dispatch</h3>
							<p>Facilitates direct, personalized B2B outreach from the user interface with custom templates, delivering inquiries straight to buyer inboxes.</p>
							<div className="api-card-footer">
								<CheckCircle2 size={14} />
								<span>Transactional Delivery &amp; Delivery Tracking</span>
							</div>
						</div>
					</div>
				</section>
			</main>

			{/* Modern Editorial Footer */}
			<footer className="luxury-footer">
				<div className="footer-top">
					<div className="footer-brand">
						<span className="brand-logo-text">DECOR<span>PRO</span></span>
						<p>Empowering artisan home decor brands with real-time US B2B buyer discovery and streamlined trade outreach.</p>
					</div>
					<div className="footer-links">
						<div className="footer-col">
							<h4>Platform</h4>
							<a href="#find-buyers">Search Engine</a>
							<a href="#buyers">Buyer Directory</a>
							<a href="#api-suite">API Architecture</a>
						</div>
						<div className="footer-col">
							<h4>Integrations</h4>
							<span>Google Places API</span>
							<span>Hunter.io Email API</span>
							<span>Resend Delivery API</span>
						</div>
					</div>
				</div>
				<div className="footer-bottom">
					<span>&copy; {new Date().getFullYear()} DecorPro B2B Buyer Radar. All rights reserved.</span>
					<span>Built for high-intent B2B partnership outreach across the United States.</span>
				</div>
			</footer>

			{/* Email Outreach Modal */}
			{selectedBuyer && (
				<EmailModal
					buyer={selectedBuyer}
					onClose={() => setSelectedBuyer(null)}
					onSuccess={(message) => setToast(message)}
				/>
			)}

			{/* Toast Notification */}
			{toast && (
				<div className="luxury-toast-alert" role="status">
					<div className="toast-check-badge">✓</div>
					<div className="toast-text-wrap">
						<div className="toast-title">Outreach Dispatched</div>
						<div className="toast-body">{toast}</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default Dashboard

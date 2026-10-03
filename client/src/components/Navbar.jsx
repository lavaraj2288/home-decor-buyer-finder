import { ArrowUpRight, CheckCircle2, Layers, Sparkles } from 'lucide-react'

function Navbar({ backendStatus }) {
	return (
		<header className="topbar">
			<div className="topbar-inner">
				<a className="brand" href="#dashboard" aria-label="DecorPro Buyer Radar">
					<div className="brand-logo-mark">
						<Layers size={18} strokeWidth={2.2} />
					</div>
					<div className="brand-text">
						<span className="brand-title">DECOR<span>PRO</span></span>
						<span className="brand-subtitle">US B2B BUYER RADAR</span>
					</div>
				</a>

				<nav className="main-nav" aria-label="Main navigation">
					<a className="nav-link active" href="#dashboard">Live Discovery</a>
					<a className="nav-link" href="#find-buyers">Search Hub</a>
					<a className="nav-link" href="#buyers">Buyer Directory</a>
					<a className="nav-link" href="#api-suite">API Pipeline</a>
				</nav>

				<div className="topbar-right">
					<div className={`api-health-pill status-${backendStatus}`}>
						<span className="pulse-dot" />
						<span className="health-label">
							{backendStatus === 'connected' ? 'API Engine Active' : backendStatus === 'checking' ? 'Connecting APIs...' : 'Offline'}
						</span>
					</div>

					<div className="header-chips">
						<span className="api-mini-badge" title="Google Places API New"><CheckCircle2 size={12} /> Places API</span>
						<span className="api-mini-badge" title="Hunter.io Domain Search"><CheckCircle2 size={12} /> Hunter</span>
						<span className="api-mini-badge" title="Resend Outreach Dispatch"><CheckCircle2 size={12} /> Resend</span>
					</div>

					<a className="topbar-cta" href="#find-buyers">
						<Sparkles size={14} />
						<span>Find Buyers</span>
						<ArrowUpRight size={14} />
					</a>
				</div>
			</div>
		</header>
	)
}

export default Navbar

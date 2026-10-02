import { ArrowUpRight, CircleHelp, Compass } from 'lucide-react'

const statusLabels = {
	checking: 'Checking connection...',
	connected: 'Backend Connected',
	offline: 'Backend Offline',
}

function Navbar({ backendStatus }) {
	return (
		<header className="topbar">
			<a className="brand" href="#dashboard" aria-label="HomeDecor Buyer Finder home">
				<span className="brand-symbol"><Compass size={19} strokeWidth={1.8} /></span>
				<span className="brand-name">HomeDecor <b>Buyer Finder</b></span>
			</a>
			<nav className="main-nav" aria-label="Main navigation">
				<a className="nav-link active" href="#dashboard">Dashboard</a>
				<a className="nav-link" href="#find-buyers">Find Buyers</a>
				<a className="nav-link" href="#buyers">Email Outreach</a>
			</nav>
			<div className="topbar-right">
				<span className={`backend-status status-${backendStatus}`}><span className="status-dot" />{statusLabels[backendStatus]}</span>
				<a className="help-link" href="#buyers" aria-label="Help"><CircleHelp size={18} /></a>
				<a className="topbar-action" href="#find-buyers">Start a search <ArrowUpRight size={15} /></a>
			</div>
		</header>
	)
}

export default Navbar

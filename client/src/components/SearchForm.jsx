import { useState } from 'react'
import { Filter, Flame, MapPin, Search, SlidersHorizontal, Sparkles } from 'lucide-react'

const buyerTypes = [
	'Interior Designers',
	'Home Decor Stores',
	'Furniture Stores',
	'Home Furnishing Retailers',
	'Gift Shops',
	'Interior Design Firms',
]

const categoryPresets = [
	{ label: 'Lamps & Lighting', value: 'lamps' },
	{ label: 'Wall Decor & Art', value: 'wall decor' },
	{ label: 'Ceramics & Vases', value: 'ceramics' },
	{ label: 'Artisan Furniture', value: 'furniture' },
	{ label: 'Textiles & Rugs', value: 'rugs' },
	{ label: 'Luxury Candles', value: 'scented candles' },
]

const locationPresets = [
	'United States',
	'New York, NY',
	'California',
	'Miami, FL',
	'Texas',
	'Chicago, IL',
]

function SearchForm({ onSearch, isSearching }) {
	const [keyword, setKeyword] = useState('lamps')
	const [buyerType, setBuyerType] = useState(buyerTypes[0])
	const [location, setLocation] = useState('United States')
	const [keywords, setKeywords] = useState('luxury')
	const [limit, setLimit] = useState('10')

	function submit(event) {
		event.preventDefault()
		onSearch({ keyword: keyword.trim(), buyerType, location: location.trim(), keywords: keywords.trim(), limit })
	}

	return (
		<div className="search-command-card">
			{/* Preset category chips */}
			<div className="presets-strip">
				<div className="presets-label">
					<Flame size={13} />
					<span>Trending Categories:</span>
				</div>
				<div className="preset-chips">
					{categoryPresets.map((preset) => (
						<button
							key={preset.value}
							type="button"
							className={`preset-chip ${keyword.toLowerCase() === preset.value.toLowerCase() ? 'active' : ''}`}
							onClick={() => setKeyword(preset.value)}
						>
							{preset.label}
						</button>
					))}
				</div>
			</div>

			<form className="search-form-grid" onSubmit={submit}>
				<div className="field-group product-group">
					<label htmlFor="search-product" className="field-label">
						<span>Product or Category</span>
						<span className="badge-required">Live Query</span>
					</label>
					<div className="input-wrap">
						<Search size={16} className="input-icon" />
						<input
							id="search-product"
							required
							value={keyword}
							onChange={(event) => setKeyword(event.target.value)}
							placeholder="e.g. wall decor, ceramic vases, lamps..."
						/>
					</div>
				</div>

				<div className="field-group">
					<label htmlFor="search-type" className="field-label">
						<span>Target Buyer Type</span>
					</label>
					<div className="input-wrap select-wrap">
						<Filter size={15} className="input-icon" />
						<select
							id="search-type"
							value={buyerType}
							onChange={(event) => setBuyerType(event.target.value)}
						>
							{buyerTypes.map((type) => (
								<option key={type} value={type}>{type}</option>
							))}
						</select>
					</div>
				</div>

				<div className="field-group">
					<label htmlFor="search-location" className="field-label">
						<span>US Location</span>
					</label>
					<div className="input-wrap">
						<MapPin size={15} className="input-icon" />
						<input
							id="search-location"
							required
							value={location}
							onChange={(event) => setLocation(event.target.value)}
							placeholder="e.g. New York, California, United States"
						/>
					</div>
				</div>

				<div className="field-group">
					<label htmlFor="search-keywords" className="field-label">
						<span>Niche Keyword</span>
						<span className="badge-optional">Optional</span>
					</label>
					<div className="input-wrap">
						<Sparkles size={15} className="input-icon" />
						<input
							id="search-keywords"
							value={keywords}
							onChange={(event) => setKeywords(event.target.value)}
							placeholder="e.g. luxury, modern, boho"
						/>
					</div>
				</div>

				<div className="field-group limit-group">
					<label htmlFor="search-limit" className="field-label">
						<span>Limit</span>
					</label>
					<div className="input-wrap select-wrap">
						<SlidersHorizontal size={15} className="input-icon" />
						<select
							id="search-limit"
							value={limit}
							onChange={(event) => setLimit(event.target.value)}
						>
							<option value="10">10</option>
							<option value="20">20</option>
							<option value="30">30</option>
						</select>
					</div>
				</div>

				<div className="submit-group">
					<button className="primary-search-button" type="submit" disabled={isSearching}>
						{isSearching ? (
							<>
								<span className="search-spin" />
								<span>Discovering...</span>
							</>
						) : (
							<>
								<Search size={16} />
								<span>Find Buyers</span>
							</>
						)}
					</button>
				</div>
			</form>

			{/* Location quick chips */}
			<div className="location-quick-bar">
				<span className="quick-location-title">Quick Regions:</span>
				<div className="quick-location-chips">
					{locationPresets.map((loc) => (
						<button
							key={loc}
							type="button"
							className={`location-chip ${location === loc ? 'active' : ''}`}
							onClick={() => setLocation(loc)}
						>
							<MapPin size={11} />
							<span>{loc}</span>
						</button>
					))}
				</div>
			</div>
		</div>
	)
}

export default SearchForm

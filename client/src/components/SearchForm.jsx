import { useState } from 'react'
import { MapPin, Search } from 'lucide-react'

const buyerTypes = [
	'Interior Designers',
	'Home Decor Stores',
	'Furniture Stores',
	'Home Furnishing Retailers',
	'Gift Shops',
	'Interior Design Firms',
]

function SearchForm({ onSearch, isSearching }) {
	const [keyword, setKeyword] = useState('')
	const [buyerType, setBuyerType] = useState(buyerTypes[0])
	const [location, setLocation] = useState('United States')
	const [keywords, setKeywords] = useState('')
	const [limit, setLimit] = useState('10')

	function submit(event) {
		event.preventDefault()
		onSearch({ keyword: keyword.trim(), buyerType, location: location.trim(), keywords: keywords.trim(), limit })
	}

	return (
		<form className="search-form" onSubmit={submit}>
			<label className="field field-product"><span>Product / category</span><input required value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="e.g. wall decor, lamps, furniture" /></label>
			<label className="field"><span>Buyer type</span><select value={buyerType} onChange={(event) => setBuyerType(event.target.value)}>{buyerTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
			<label className="field field-location"><span>Location</span><div className="input-with-icon"><MapPin size={15} /><input required value={location} onChange={(event) => setLocation(event.target.value)} aria-label="Location" /></div></label>
			<label className="field"><span>Keywords <em>OPTIONAL</em></span><input value={keywords} onChange={(event) => setKeywords(event.target.value)} placeholder="e.g. luxury interiors" /></label>
			<label className="field field-limit"><span>Results</span><select value={limit} onChange={(event) => setLimit(event.target.value)}>{['10', '20', '30'].map((number) => <option key={number} value={number}>{number}</option>)}</select></label>
			<button className="search-button" type="submit" disabled={isSearching}><Search size={17} />{isSearching ? 'Searching...' : 'Find buyers'}</button>
		</form>
	)
}

export default SearchForm

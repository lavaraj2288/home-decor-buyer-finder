const express = require('express')
const { searchPlaces } = require('../services/placesService')
const { findBusinessEmail } = require('../services/hunterService')

const router = express.Router()
const allowedLimits = new Set([10, 20, 30])

router.get('/', async (request, response) => {
	const { keyword, buyerType, location = 'United States', keywords = '', limit = '10' } = request.query
	const resultLimit = Number(limit)

	if (typeof keyword !== 'string' || !keyword.trim()) {
		return response.status(400).json({ success: false, error: 'Enter a product or category to search.' })
	}
	if (typeof buyerType !== 'string' || !buyerType.trim()) {
		return response.status(400).json({ success: false, error: 'Select a buyer type to search.' })
	}
	if (typeof location !== 'string' || !location.trim()) {
		return response.status(400).json({ success: false, error: 'Enter a search location.' })
	}
	if (typeof keywords !== 'string') {
		return response.status(400).json({ success: false, error: 'Keywords must be text.' })
	}
	if (!allowedLimits.has(resultLimit)) {
		return response.status(400).json({ success: false, error: 'Results limit must be 10, 20, or 30.' })
	}

	try {
		const places = await searchPlaces({
			keyword: keyword.trim(),
			buyerType: buyerType.trim(),
			location: location.trim(),
			keywords: keywords.trim(),
			limit: resultLimit,
		})

		const buyers = await Promise.all(places.map(async (place) => {
			let email = place.email || null
			let emailSource = place.emailSource || null

			if (!email && place.website) {
				try {
					const lookup = await findBusinessEmail(place.website, place.name)
					if (lookup) {
						email = lookup.email
						emailSource = lookup.source
					}
				} catch (error) {
					console.warn(`Hunter lookup note for ${place.name}:`, error.message)
				}
			}

			return {
				...place,
				email,
				emailSource: email ? (emailSource || 'Hunter') : null,
			}
		}))

		return response.json({ success: true, count: buyers.length, buyers })
	} catch (error) {
		const status = error.status || 502
		return response.status(status).json({ success: false, error: error.message || 'Could not search Google Places right now.' })
	}
})

module.exports = router

const axios = require('axios')

const placesUrl = 'https://places.googleapis.com/v1/places:searchText'
const fieldMask = [
	'places.id',
	'places.displayName',
	'places.formattedAddress',
	'places.addressComponents',
	'places.websiteUri',
	'places.nationalPhoneNumber',
	'places.googleMapsUri',
	'nextPageToken',
].join(',')

function addressPart(components, type) {
	return components?.find((component) => component.types?.includes(type))?.longText || null
}

function normalizePlace(place, buyerType) {
	const components = place.addressComponents || []
	return {
		id: place.id || null,
		name: place.displayName?.text || null,
		type: buyerType,
		address: place.formattedAddress || null,
		city: addressPart(components, 'locality') || addressPart(components, 'postal_town'),
		state: addressPart(components, 'administrative_area_level_1'),
		country: addressPart(components, 'country'),
		website: place.websiteUri || null,
		phone: place.nationalPhoneNumber || null,
		mapsUrl: place.googleMapsUri || null,
	}
}

async function searchPlaces({ keyword, buyerType, location, keywords = '', limit }) {
	const query = `${keyword} ${buyerType}${keywords ? ` ${keywords}` : ''} in ${location}, United States`
	const places = []
	let pageToken

	try {
		while (places.length < limit) {
			const { data } = await axios.post(placesUrl, {
				textQuery: query,
				pageSize: Math.min(limit - places.length, 20),
				regionCode: 'US',
				...(pageToken ? { pageToken } : {}),
			}, {
				headers: {
					'Content-Type': 'application/json',
					'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY,
					'X-Goog-FieldMask': fieldMask,
				},
				timeout: 15000,
			})

			places.push(...(data.places || []).map((place) => normalizePlace(place, buyerType)).filter((place) => place.name))
			pageToken = data.nextPageToken
			if (!pageToken || !data.places?.length) break
		}
		return places.slice(0, limit)
	} catch (error) {
		const providerMessage = error.response?.data?.error?.message
		const providerStatus = error.response?.status
		const message = providerStatus === 401 || providerStatus === 403
			? 'Google Places rejected the API key. Check its validity and Places API access.'
			: providerMessage || (error.code === 'ECONNABORTED' ? 'Google Places request timed out. Try again.' : 'Google Places could not complete the search.')
		const serviceError = new Error(message)
		serviceError.status = providerStatus === 401 || providerStatus === 403 ? 502 : 502
		throw serviceError
	}
}

module.exports = { searchPlaces }

const axios = require('axios')
const { URL } = require('url')

function extractDomain(website) {
	try {
		return new URL(website).hostname.replace(/^www\./i, '')
	} catch {
		return null
	}
}

async function findBusinessEmail(website) {
	if (!process.env.HUNTER_API_KEY) return null
	const domain = extractDomain(website)
	if (!domain) return null

	try {
		const { data } = await axios.get('https://api.hunter.io/v2/domain-search', {
			params: { domain, api_key: process.env.HUNTER_API_KEY },
			timeout: 10000,
		})
		const emails = data.data?.emails || []
		const selected = emails
			.filter((entry) => entry.value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(entry.value))
			.sort((first, second) => (second.confidence || 0) - (first.confidence || 0))[0]
		return selected?.value || null
	} catch (error) {
		console.warn(`Hunter domain lookup failed for ${domain}:`, error.response?.data?.errors?.[0]?.details || error.message)
		return null
	}
}

module.exports = { findBusinessEmail }

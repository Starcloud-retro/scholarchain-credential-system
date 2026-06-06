const STORAGE_KEY = 'scholarchain.issuerOrganizations'

function readLabels() {
	if (typeof window === 'undefined') return {}

	try {
		return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}')
	} catch {
		return {}
	}
}

function writeLabels(labels) {
	if (typeof window === 'undefined') return

	window.localStorage.setItem(STORAGE_KEY, JSON.stringify(labels))
}

export function getIssuerOrganizationLabel(address) {
	if (!address) return ''

	const labels = readLabels()
	return labels[address.toLowerCase()] || ''
}

export function setIssuerOrganizationLabel(address, label) {
	if (!address || !label) return

	const normalizedAddress = address.toLowerCase()
	const labels = readLabels()
	labels[normalizedAddress] = label.trim()
	writeLabels(labels)
}

export function removeIssuerOrganizationLabel(address) {
	if (!address) return

	const labels = readLabels()
	delete labels[address.toLowerCase()]
	writeLabels(labels)
}

import { useState } from 'react'
import CredentialCard from '../components/CredentialCard'
import CredentialDetailsModal from '../components/CredentialDetailsModal'
import { fetchCredentialMetadata, getCredential } from '../contracts/ScholarChainService'

export default function VerifyCredential() {
	const [tokenId, setTokenId] = useState('')
	const [credential, setCredential] = useState(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [selectedCredential, setSelectedCredential] = useState(null)

	const handleVerify = async (event) => {
		event.preventDefault()
		setError('')
		setCredential(null)
		setSelectedCredential(null)

		if (!tokenId.trim()) {
			setError('Please enter a token ID.')
			return
		}

		setLoading(true)
		try {
			const data = await getCredential(tokenId.trim())
			let metadata = null

			try {
				metadata = await fetchCredentialMetadata(data.metadataURI)
			} catch {
				metadata = null
			}

			setCredential({
				...data,
				metadata,
			})
		} catch (verifyError) {
			setError(verifyError.message || 'Unable to fetch credential')
		} finally {
			setLoading(false)
		}
	}

	return (
		<section className="mx-auto max-w-5xl space-y-6">
			<form
				onSubmit={handleVerify}
				className="rounded-2xl border border-white/10 bg-slate-900/70 p-6"
			>
				<h1 className="text-2xl font-bold text-white">Verify Credential</h1>
				<p className="mt-1 text-sm text-slate-300">
					Enter token ID to fetch on-chain credential details.
				</p>

				<div className="mt-4 flex flex-col gap-3 sm:flex-row">
					<input
						value={tokenId}
						onChange={(event) => setTokenId(event.target.value)}
						placeholder="Token ID"
						className="flex-1 rounded-lg border border-white/15 bg-slate-950/70 px-3 py-2 outline-none ring-cyan-300 transition focus:ring-2"
					/>
					<button
						type="submit"
						disabled={loading}
						className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-65"
					>
						{loading ? 'Verifying...' : 'Verify'}
					</button>
				</div>

				{credential?.metadataURI ? (
					<div className="mt-4 flex flex-wrap gap-3">
						<button
							type="button"
							onClick={() => window.open(credential.metadataURI, '_blank', 'noreferrer')}
							className="rounded-lg border border-cyan-300/25 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/20"
						>
							Open Metadata
						</button>
					</div>
				) : null}

				{error ? (
					<p className="mt-4 rounded-lg border border-rose-300/40 bg-rose-500/10 p-3 text-sm text-rose-200">
						{error}
					</p>
				) : null}
			</form>

			{credential ? (
				<CredentialCard credential={credential} onOpen={setSelectedCredential} />
			) : null}

			{selectedCredential ? (
				<CredentialDetailsModal
					credential={{
						...selectedCredential,
						imageSource: selectedCredential.metadata?.image
							? selectedCredential.metadata.image
							: '',
					}}
					onClose={() => setSelectedCredential(null)}
				/>
			) : null}
		</section>
	)
}

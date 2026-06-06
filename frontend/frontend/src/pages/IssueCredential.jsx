import { useMemo, useState } from 'react'
import { mintCredential } from '../contracts/ScholarChainService'
import { CREDENTIAL_TYPE_OPTIONS } from '../contracts/credentialTypes'

const initialState = {
	student: '',
	credentialId: '',
	achievementTitle: '',
	issuerName: '',
	credentialType: '0',
	metadataURI: '',
}

export default function IssueCredential({ walletState }) {
	const {
		account,
		isAuthorizedIssuerRole,
		handleConnectWallet,
		handleSwitchAccount,
		handleDisconnectWallet,
	} = walletState
	const [form, setForm] = useState(initialState)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [result, setResult] = useState('')
	const [error, setError] = useState('')

	const canSubmit = useMemo(() => {
		return (
			form.student &&
			form.credentialId &&
			form.achievementTitle &&
			form.issuerName &&
			form.metadataURI
		)
	}, [form])

	const updateField = (event) => {
		const { name, value } = event.target
		setForm((prev) => ({ ...prev, [name]: value }))
	}

	const handleSubmit = async (event) => {
		event.preventDefault()
		setError('')
		setResult('')

		if (!account) {
			setError('Please connect wallet first.')
			return
		}

		if (!isAuthorizedIssuerRole) {
			setError('Only authorized issuer can mint credentials.')
			return
		}

		setIsSubmitting(true)
		try {
			const minted = await mintCredential({
				student: form.student.trim(),
				credentialId: form.credentialId.trim(),
				achievementTitle: form.achievementTitle.trim(),
				issuerName: form.issuerName.trim(),
				credentialType: Number(form.credentialType),
				metadataURI: form.metadataURI.trim(),
			})

			const tokenPart = minted.tokenId ? ` Token ID: ${minted.tokenId}.` : ''
			setResult(`Credential minted successfully.${tokenPart} Tx: ${minted.hash}`)
			setForm(initialState)
		} catch (submitError) {
			setError(submitError.message || 'Failed to mint credential')
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<section className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-slate-900/70 p-6 sm:p-8">
			<h1 className="text-2xl font-bold text-white">Issue Credential</h1>
			<p className="mt-1 text-sm text-slate-300">
				Connect an authorized issuer wallet from the top navigation to mint credentials.
			</p>

			{!account ? (
				<p className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
					Connect an authorized issuer wallet to mint credentials.
				</p>
			) : !isAuthorizedIssuerRole ? (
				<p className="rounded-lg border border-rose-300/40 bg-rose-500/10 p-4 text-sm text-rose-200">
					Only authorized issuer can mint credentials.
				</p>
			) : (
				<form className="grid gap-4" onSubmit={handleSubmit}>
					<label className="grid gap-1 text-sm">
						<span className="text-slate-300">Student Wallet Address</span>
						<input
							name="student"
							value={form.student}
							onChange={updateField}
							placeholder="0x..."
							className="rounded-lg border border-white/15 bg-slate-950/70 px-3 py-2 outline-none ring-cyan-300 transition focus:ring-2"
							disabled={isSubmitting}
						/>
					</label>

					<label className="grid gap-1 text-sm">
						<span className="text-slate-300">Credential ID</span>
						<input
							name="credentialId"
							value={form.credentialId}
							onChange={updateField}
							className="rounded-lg border border-white/15 bg-slate-950/70 px-3 py-2 outline-none ring-cyan-300 transition focus:ring-2"
							disabled={isSubmitting}
						/>
					</label>

					<label className="grid gap-1 text-sm">
						<span className="text-slate-300">Achievement Title</span>
						<input
							name="achievementTitle"
							value={form.achievementTitle}
							onChange={updateField}
							className="rounded-lg border border-white/15 bg-slate-950/70 px-3 py-2 outline-none ring-cyan-300 transition focus:ring-2"
							disabled={isSubmitting}
						/>
					</label>

					<label className="grid gap-1 text-sm">
						<span className="text-slate-300">Issuer Name</span>
						<input
							name="issuerName"
							value={form.issuerName}
							onChange={updateField}
							className="rounded-lg border border-white/15 bg-slate-950/70 px-3 py-2 outline-none ring-cyan-300 transition focus:ring-2"
							disabled={isSubmitting}
						/>
					</label>

					<label className="grid gap-1 text-sm">
						<span className="text-slate-300">Credential Type</span>
						<select
							name="credentialType"
							value={form.credentialType}
							onChange={updateField}
							className="rounded-lg border border-white/15 bg-slate-950/70 px-3 py-2 outline-none ring-cyan-300 transition focus:ring-2"
							disabled={isSubmitting}
						>
							{CREDENTIAL_TYPE_OPTIONS.map((item) => (
								<option key={item.value} value={item.value}>
									{item.label}
								</option>
							))}
						</select>
					</label>

					<label className="grid gap-1 text-sm">
						<span className="text-slate-300">Metadata URI</span>
						<input
							name="metadataURI"
							value={form.metadataURI}
							onChange={updateField}
							placeholder="ipfs://..."
							className="rounded-lg border border-white/15 bg-slate-950/70 px-3 py-2 outline-none ring-cyan-300 transition focus:ring-2"
							disabled={isSubmitting}
						/>
					</label>

					<button
						type="submit"
							disabled={!canSubmit || isSubmitting}
						className="mt-2 rounded-lg bg-emerald-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-65"
					>
						{isSubmitting ? 'Minting...' : 'Mint Credential'}
					</button>
				</form>
			)}

			{result ? (
				<p className="mt-4 rounded-lg border border-emerald-300/40 bg-emerald-500/10 p-3 text-sm text-emerald-200">
					{result}
				</p>
			) : null}

			{error ? (
				<p className="mt-4 rounded-lg border border-rose-300/40 bg-rose-500/10 p-3 text-sm text-rose-200">
					{error}
				</p>
			) : null}
		</section>
	)
}

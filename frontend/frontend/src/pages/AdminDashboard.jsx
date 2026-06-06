import { useEffect, useMemo, useState } from 'react'
import {
	addAuthorizedIssuer,
	getCredential,
	getAuthorizedIssuers,
	getTotalCredentialsIssued,
	removeAuthorizedIssuer,
} from '../contracts/ScholarChainService'
import {
	getIssuerOrganizationLabel,
	removeIssuerOrganizationLabel,
	setIssuerOrganizationLabel,
} from '../contracts/issuerOrganizations'

function shortenAddress(address) {
	if (!address) return ''
	return `${address.slice(0, 6)}...${address.slice(-5)}`
}

export default function AdminDashboard({ walletState }) {
	const {
		account,
		isAuthorizedIssuerRole,
		isContractOwner,
	} = walletState

	const [totalCredentials, setTotalCredentials] = useState(0)
	const [authorizedIssuers, setAuthorizedIssuers] = useState([])
	const [recentCredentials, setRecentCredentials] = useState([])
	const [typeStats, setTypeStats] = useState([])
	const [issuerWallet, setIssuerWallet] = useState('')
	const [issuerLabel, setIssuerLabel] = useState('')
	const [loading, setLoading] = useState(false)
	const [submitting, setSubmitting] = useState(false)
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')

	const canView = useMemo(() => Boolean(account && isAuthorizedIssuerRole), [account, isAuthorizedIssuerRole])
	const loadDashboard = async () => {
		setLoading(true)
		setError('')
		try {
			const [total, issuers] = await Promise.all([
				getTotalCredentialsIssued(),
				getAuthorizedIssuers(),
			])
			setTotalCredentials(total)
			setAuthorizedIssuers(issuers)

			const recentIds = []
			for (let id = total; id >= 1 && recentIds.length < 5; id -= 1) {
				recentIds.push(id)
			}

			const recentItems = await Promise.all(
				recentIds.map(async (id) => {
					try {
						return await getCredential(String(id))
					} catch {
						return null
					}
				}),
			)
			const filteredRecent = recentItems.filter(Boolean)
			setRecentCredentials(filteredRecent)

			const statsMap = new Map()
			for (let id = 1; id <= total; id += 1) {
				try {
					const item = await getCredential(String(id))
					const key = item.credentialTypeLabel || 'Unknown'
					statsMap.set(key, (statsMap.get(key) || 0) + 1)
				} catch {
					continue
				}
			}
			setTypeStats(Array.from(statsMap.entries()).map(([label, count]) => ({ label, count })))
		} catch (dashboardError) {
			setError(dashboardError.message || 'Failed to load admin dashboard')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (!canView) return

		const bootstrapDashboard = async () => {
			await loadDashboard()
		}

		void bootstrapDashboard()
	}, [canView])

	const handleAddIssuer = async (event) => {
		event.preventDefault()
		setError('')
		setSuccess('')

		if (!issuerWallet.trim()) {
			setError('Please enter an issuer wallet address.')
			return
		}

		setSubmitting(true)
		try {
			await addAuthorizedIssuer(issuerWallet.trim())
			if (issuerLabel.trim()) {
				setIssuerOrganizationLabel(issuerWallet.trim(), issuerLabel.trim())
			}
			setIssuerWallet('')
			setIssuerLabel('')
			setSuccess('Issuer added successfully.')
			await loadDashboard()
		} catch (addError) {
			setError(addError.message || 'Failed to add issuer')
		} finally {
			setSubmitting(false)
		}
	}

	const handleRemoveIssuer = async (issuerAddress) => {
		setError('')
		setSuccess('')
		setSubmitting(true)
		try {
			await removeAuthorizedIssuer(issuerAddress)
			removeIssuerOrganizationLabel(issuerAddress)
			setSuccess('Issuer removed successfully.')
			await loadDashboard()
		} catch (removeError) {
			setError(removeError.message || 'Failed to remove issuer')
		} finally {
			setSubmitting(false)
		}
	}

	if (!account) {
		return (
			<section className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-slate-900/70 p-6 sm:p-8">
				<h1 className="text-2xl font-bold text-white">Issuer Dashboard</h1>
				<p className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
					Connect an authorized issuer wallet from the top navigation to view the dashboard.
				</p>
			</section>
		)
	}

	if (!isAuthorizedIssuerRole) {
		return (
			<section className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-slate-900/70 p-6 sm:p-8">
				<h1 className="text-2xl font-bold text-white">Issuer Dashboard</h1>
				<p className="rounded-lg border border-rose-300/40 bg-rose-500/10 p-4 text-sm text-rose-200">
					Only authorized issuers can view the dashboard.
				</p>
			</section>
		)
	}

	return (
		<section className="mx-auto max-w-7xl space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
						Issuer Control Center
					</p>
					<h1 className="text-2xl font-bold text-white">Issuer Dashboard</h1>
				</div>
			</div>

			{error ? (
				<p className="rounded-lg border border-rose-300/40 bg-rose-500/10 p-3 text-sm text-rose-200">
					{error}
				</p>
			) : null}

			{success ? (
				<p className="rounded-lg border border-emerald-300/40 bg-emerald-500/10 p-3 text-sm text-emerald-200">
					{success}
				</p>
			) : null}

			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				<article className="rounded-2xl border border-white/10 bg-white/5 p-6">
					<p className="text-sm uppercase tracking-[0.18em] text-slate-400">
						Total Credentials
					</p>
					<p className="mt-3 text-4xl font-black text-white">
						{loading ? '...' : totalCredentials}
					</p>
				</article>

				<article className="rounded-2xl border border-white/10 bg-white/5 p-6">
					<p className="text-sm uppercase tracking-[0.18em] text-slate-400">
						Authorized Issuers
					</p>
					<p className="mt-3 text-4xl font-black text-white">
						{loading ? '...' : authorizedIssuers.length}
					</p>
				</article>

				<article className="rounded-2xl border border-white/10 bg-white/5 p-6">
					<p className="text-sm uppercase tracking-[0.18em] text-slate-400">
						Recent Issuances
					</p>
					<p className="mt-3 text-4xl font-black text-white">
						{loading ? '...' : recentCredentials.length}
					</p>
				</article>

				<article className="rounded-2xl border border-white/10 bg-white/5 p-6">
					<p className="text-sm uppercase tracking-[0.18em] text-slate-400">
						Credential Types
					</p>
					<p className="mt-3 text-4xl font-black text-white">
						{loading ? '...' : typeStats.length}
					</p>
				</article>
			</div>

			<section className="grid gap-4 rounded-2xl border border-white/10 bg-slate-900/70 p-6">
				<div>
					<h2 className="text-xl font-bold text-white">Credential Type Statistics</h2>
					<p className="mt-1 text-sm text-slate-300">A live breakdown of issued credential types.</p>
				</div>
				<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
					{typeStats.map((item) => (
						<div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
							<p className="text-sm uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
							<p className="mt-2 text-3xl font-black text-white">{item.count}</p>
						</div>
					))}
				</div>
			</section>

			<section className="grid gap-4 rounded-2xl border border-white/10 bg-slate-900/70 p-6">
				<div>
					<h2 className="text-xl font-bold text-white">Recently Issued Credentials</h2>
					<p className="mt-1 text-sm text-slate-300">Latest blockchain-issued records.</p>
				</div>
				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					{recentCredentials.map((item) => (
						<article key={item.tokenId} className="rounded-2xl border border-white/10 bg-white/5 p-4">
							<p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{item.credentialTypeLabel}</p>
							<h3 className="mt-2 truncate text-lg font-bold text-white">{item.achievementTitle}</h3>
							<p className="mt-1 truncate text-sm text-slate-300">{item.issuerName}</p>
							<p className="mt-2 text-sm text-slate-400">Token ID {item.tokenId}</p>
						</article>
					))}
				</div>
			</section>

			{isContractOwner ? (
				<form
					onSubmit={handleAddIssuer}
					className="grid gap-4 rounded-2xl border border-white/10 bg-slate-900/70 p-6"
				>
					<div>
						<h2 className="text-xl font-bold text-white">Add Issuer Wallet</h2>
						<p className="mt-1 text-sm text-slate-300">
							Register an authorized issuer and optionally map a label for display.
						</p>
					</div>

					<div className="grid gap-4 md:grid-cols-2">
						<label className="grid gap-1 text-sm">
							<span className="text-slate-300">Issuer Wallet Address</span>
							<input
								value={issuerWallet}
								onChange={(event) => setIssuerWallet(event.target.value)}
								placeholder="0x..."
								className="rounded-lg border border-white/15 bg-slate-950/70 px-3 py-2 outline-none ring-cyan-300 transition focus:ring-2"
								disabled={submitting}
							/>
						</label>

						<label className="grid gap-1 text-sm">
							<span className="text-slate-300">Organization Label</span>
							<input
								value={issuerLabel}
								onChange={(event) => setIssuerLabel(event.target.value)}
								placeholder="ScholarChain Academy"
								className="rounded-lg border border-white/15 bg-slate-950/70 px-3 py-2 outline-none ring-cyan-300 transition focus:ring-2"
								disabled={submitting}
							/>
						</label>
					</div>

					<button
						type="submit"
						disabled={submitting}
						className="justify-self-start rounded-lg bg-emerald-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-65"
					>
						{submitting ? 'Saving...' : 'Add Issuer'}
					</button>
				</form>
			) : null}

			{isContractOwner ? (
			<section className="grid gap-4">
				<div>
					<h2 className="text-xl font-bold text-white">Authorized Issuers</h2>
					<p className="mt-1 text-sm text-slate-300">
						Manage issuer access and keep organization labels aligned with wallet addresses.
					</p>
				</div>

				<div className="grid gap-4 lg:grid-cols-2">
					{authorizedIssuers.map((issuerAddress) => {
						const label = getIssuerOrganizationLabel(issuerAddress)
						return (
							<article
								key={issuerAddress}
								className="rounded-2xl border border-white/10 bg-white/5 p-5"
							>
								<p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
									{label || 'Authorized Issuer'}
								</p>
								<p className="mt-2 text-lg font-semibold text-white">
									{shortenAddress(issuerAddress)}
								</p>
								<p className="mt-2 break-all text-sm text-slate-300">{issuerAddress}</p>
								<button
									type="button"
									onClick={() => handleRemoveIssuer(issuerAddress)}
									disabled={submitting}
									className="mt-4 rounded-lg border border-rose-300/30 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-65"
								>
									Remove Issuer
								</button>
							</article>
						)
					})}
				</div>
			</section>
			) : null}
		</section>
	)
}

import { useEffect, useMemo, useState } from 'react'
import { addAuthorizedIssuer } from '../contracts/ScholarChainService'
import {
	APPLICATION_STATUS,
	getIssuerApplications,
	updateIssuerApplicationStatus,
} from '../data/issuerApplications'
import { setIssuerOrganization } from '../data/issuerRegistry'

const statusClasses = {
	Pending: 'border-yellow-300/40 bg-yellow-500/10 text-yellow-100',
	Approved: 'border-emerald-300/40 bg-emerald-500/10 text-emerald-100',
	Rejected: 'border-rose-300/40 bg-rose-500/10 text-rose-100',
}

function StatusBadge({ status }) {
	return (
		<span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusClasses[status]}`}>
			{status}
		</span>
	)
}

export default function Admin({ walletState }) {
	const { account, isContractOwner } = walletState
	const [applications, setApplications] = useState([])
	const [processingWallet, setProcessingWallet] = useState('')
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')

	const pendingApplications = useMemo(
		() => applications.filter((application) => application.status === APPLICATION_STATUS.PENDING),
		[applications],
	)

	const reloadApplications = () => {
		setApplications(getIssuerApplications())
	}

	useEffect(() => {
		reloadApplications()
	}, [])

	const handleApprove = async (application) => {
		setError('')
		setSuccess('')
		setProcessingWallet(application.walletAddress)

		try {
			await addAuthorizedIssuer(application.walletAddress)
			updateIssuerApplicationStatus(application.walletAddress, APPLICATION_STATUS.APPROVED)
			setIssuerOrganization({
				walletAddress: application.walletAddress,
				organizationName: application.organizationName,
				website: application.website,
			})
			reloadApplications()
			setSuccess(`${application.organizationName} approved as an issuer.`)
		} catch (approveError) {
			setError(approveError.message || 'Failed to approve application.')
		} finally {
			setProcessingWallet('')
		}
	}

	const handleReject = (application) => {
		setError('')
		setSuccess('')
		updateIssuerApplicationStatus(application.walletAddress, APPLICATION_STATUS.REJECTED)
		reloadApplications()
		setSuccess(`${application.organizationName} rejected.`)
	}

	if (!account) {
		return (
			<section className="mx-auto max-w-3xl rounded-lg border border-white/10 bg-slate-900/70 p-6 sm:p-8">
				<h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
				<p className="mt-4 rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
					Connect the contract owner wallet to review issuer applications.
				</p>
			</section>
		)
	}

	if (!isContractOwner) {
		return (
			<section className="mx-auto max-w-3xl rounded-lg border border-rose-300/30 bg-rose-500/10 p-6 sm:p-8">
				<h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
				<p className="mt-4 text-sm text-rose-100">
					Only the contract owner can view pending issuer applications.
				</p>
			</section>
		)
	}

	return (
		<section className="mx-auto max-w-6xl space-y-6">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
						Owner Console
					</p>
					<h1 className="mt-2 text-3xl font-black text-white">Admin Dashboard</h1>
					<p className="mt-3 text-sm text-slate-300">
						Review issuer applications and authorize approved wallets on-chain.
					</p>
				</div>
				<div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-right">
					<p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
						Pending Applications
					</p>
					<p className="mt-1 text-3xl font-black text-white">{pendingApplications.length}</p>
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

			<section className="grid gap-4">
				<div>
					<h2 className="text-xl font-bold text-white">Pending Applications</h2>
					<p className="mt-1 text-sm text-slate-300">
						Approving sends an `addAuthorizedIssuer(walletAddress)` transaction.
					</p>
				</div>

				{pendingApplications.length ? (
					<div className="grid gap-4 lg:grid-cols-2">
						{pendingApplications.map((application) => (
							<article
								key={application.walletAddress}
								className="grid gap-4 rounded-lg border border-white/10 bg-slate-900/70 p-5"
							>
								<div className="flex flex-wrap items-start justify-between gap-3">
									<div>
										<p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
											{application.organizationType}
										</p>
										<h3 className="mt-2 text-xl font-bold text-white">
											{application.organizationName}
										</h3>
									</div>
									<StatusBadge status={application.status} />
								</div>

								<div className="grid gap-3 text-sm text-slate-300">
									<p>
										<span className="font-semibold text-slate-100">Website:</span>{' '}
										<a
											href={application.website}
											target="_blank"
											rel="noreferrer"
											className="break-all text-cyan-200 hover:text-cyan-100"
										>
											{application.website}
										</a>
									</p>
									<p>
										<span className="font-semibold text-slate-100">Wallet Address:</span>{' '}
										<span className="break-all">{application.walletAddress}</span>
									</p>
									<p>
										<span className="font-semibold text-slate-100">Status:</span>{' '}
										{application.status}
									</p>
								</div>

								<div className="flex flex-wrap gap-3">
									<button
										type="button"
										onClick={() => handleApprove(application)}
										disabled={processingWallet === application.walletAddress}
										className="rounded-lg bg-emerald-400 px-4 py-2 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-65"
									>
										{processingWallet === application.walletAddress ? 'Approving...' : 'Approve'}
									</button>
									<button
										type="button"
										onClick={() => handleReject(application)}
										disabled={Boolean(processingWallet)}
										className="rounded-lg border border-rose-300/40 bg-rose-500/10 px-4 py-2 text-sm font-bold text-rose-100 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-65"
									>
										Reject
									</button>
								</div>
							</article>
						))}
					</div>
				) : (
					<div className="rounded-lg border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
						No pending applications.
					</div>
				)}
			</section>
		</section>
	)
}

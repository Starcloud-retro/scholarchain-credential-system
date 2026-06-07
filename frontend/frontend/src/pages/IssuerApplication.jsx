import { useEffect, useMemo, useState } from 'react'
import { saveIssuerApplication } from '../data/issuerApplications'

const ORGANIZATION_TYPES = [
	'University',
	'Company',
	'NGO',
	'Research Institute',
	'Training Academy',
]

const initialForm = {
	organizationName: '',
	organizationType: ORGANIZATION_TYPES[0],
	website: '',
	email: '',
	walletAddress: '',
	reason: '',
}

export default function IssuerApplication({ walletState }) {
	const { account, isAuthorizedIssuerRole } = walletState
	const [form, setForm] = useState(() => ({
		...initialForm,
		walletAddress: account || '',
	}))
	const [success, setSuccess] = useState('')
	const [error, setError] = useState('')

	useEffect(() => {
		if (!account) return

		setForm((current) => ({
			...current,
			walletAddress: current.walletAddress || account,
		}))
	}, [account])

	const canSubmit = useMemo(
		() =>
			form.organizationName.trim() &&
			form.organizationType &&
			form.website.trim() &&
			form.email.trim() &&
			form.walletAddress.trim() &&
			form.reason.trim(),
		[form],
	)

	const updateField = (field, value) => {
		setForm((current) => ({
			...current,
			[field]: value,
		}))
	}

	const handleSubmit = (event) => {
		event.preventDefault()
		setError('')
		setSuccess('')

		if (!canSubmit) {
			setError('Please complete every field before submitting.')
			return
		}

		saveIssuerApplication(form)
		setSuccess('Application submitted with Pending status.')
		setForm({
			...initialForm,
			walletAddress: account || '',
		})
	}

	if (isAuthorizedIssuerRole) {
		return (
			<section className="mx-auto max-w-3xl rounded-lg border border-emerald-300/30 bg-emerald-500/10 p-6 sm:p-8">
				<p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200">
					Issuer Access Active
				</p>
				<h1 className="mt-2 text-2xl font-bold text-white">Your wallet is already an issuer</h1>
				<p className="mt-3 text-sm text-emerald-100">
					The application form is hidden for authorized issuer wallets.
				</p>
			</section>
		)
	}

	return (
		<section className="mx-auto max-w-4xl space-y-6">
			<div>
				<p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
					Issuer Registration
				</p>
				<h1 className="mt-2 text-3xl font-black text-white">Apply As Issuer</h1>
				<p className="mt-3 max-w-2xl text-sm text-slate-300">
					Register your organization to request credential issuing access on ScholarChain.
				</p>
			</div>

			<form
				onSubmit={handleSubmit}
				className="grid gap-5 rounded-lg border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 sm:p-8"
			>
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

				<div className="grid gap-4 md:grid-cols-2">
					<label className="grid gap-2 text-sm">
						<span className="font-semibold text-slate-200">Organization Name</span>
						<input
							value={form.organizationName}
							onChange={(event) => updateField('organizationName', event.target.value)}
							className="rounded-lg border border-white/15 bg-slate-950/70 px-3 py-3 text-white outline-none ring-cyan-300 transition focus:ring-2"
							placeholder="Northbridge University"
						/>
					</label>

					<label className="grid gap-2 text-sm">
						<span className="font-semibold text-slate-200">Organization Type</span>
						<select
							value={form.organizationType}
							onChange={(event) => updateField('organizationType', event.target.value)}
							className="rounded-lg border border-white/15 bg-slate-950/70 px-3 py-3 text-white outline-none ring-cyan-300 transition focus:ring-2"
						>
							{ORGANIZATION_TYPES.map((type) => (
								<option key={type} value={type}>
									{type}
								</option>
							))}
						</select>
					</label>

					<label className="grid gap-2 text-sm">
						<span className="font-semibold text-slate-200">Official Website</span>
						<input
							value={form.website}
							onChange={(event) => updateField('website', event.target.value)}
							className="rounded-lg border border-white/15 bg-slate-950/70 px-3 py-3 text-white outline-none ring-cyan-300 transition focus:ring-2"
							placeholder="https://example.edu"
						/>
					</label>

					<label className="grid gap-2 text-sm">
						<span className="font-semibold text-slate-200">Organization Email</span>
						<input
							type="email"
							value={form.email}
							onChange={(event) => updateField('email', event.target.value)}
							className="rounded-lg border border-white/15 bg-slate-950/70 px-3 py-3 text-white outline-none ring-cyan-300 transition focus:ring-2"
							placeholder="credentials@example.edu"
						/>
					</label>
				</div>

				<label className="grid gap-2 text-sm">
					<span className="font-semibold text-slate-200">Wallet Address</span>
					<input
						value={form.walletAddress}
						onChange={(event) => updateField('walletAddress', event.target.value)}
						className="rounded-lg border border-white/15 bg-slate-950/70 px-3 py-3 text-white outline-none ring-cyan-300 transition focus:ring-2"
						placeholder="0x..."
					/>
				</label>

				<label className="grid gap-2 text-sm">
					<span className="font-semibold text-slate-200">Reason For Joining</span>
					<textarea
						value={form.reason}
						onChange={(event) => updateField('reason', event.target.value)}
						className="min-h-32 rounded-lg border border-white/15 bg-slate-950/70 px-3 py-3 text-white outline-none ring-cyan-300 transition focus:ring-2"
						placeholder="Tell the admin why your organization should issue credentials."
					/>
				</label>

				<button
					type="submit"
					className="justify-self-start rounded-lg bg-gradient-to-r from-cyan-400 to-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110"
				>
					Apply As Issuer
				</button>
			</form>
		</section>
	)
}

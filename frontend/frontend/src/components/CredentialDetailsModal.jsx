function DetailRow({ label, value, children }) {
	return (
		<div className="grid gap-1 rounded-xl border border-white/10 bg-white/5 p-4 sm:grid-cols-[160px_1fr] sm:gap-4">
			<dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
				{label}
			</dt>
			<dd className="min-w-0 text-sm text-slate-100">
				{children || <span className="break-all">{value || 'N/A'}</span>}
			</dd>
		</div>
	)
}

function resolveImageSource(credential) {
	const image = credential?.imageSource || credential?.metadata?.image || credential?.metadata?.image_url || credential?.metadata?.imageUrl
	if (!image) return ''
	if (image.startsWith('ipfs://')) {
		return `https://ipfs.io/ipfs/${image.replace('ipfs://', '')}`
	}
	return image
}

async function copyText(value) {
	if (!value) return
	if (navigator.clipboard?.writeText) {
		await navigator.clipboard.writeText(value)
	}
}

export default function CredentialDetailsModal({ credential, onClose }) {
	if (!credential) return null

	const imageSource = resolveImageSource(credential)
	const metadataLink = credential.metadataURI || ''

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
			<button
				type="button"
				aria-label="Close credential details"
				onClick={onClose}
				className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
			/>

			<div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-[28px] border border-white/10 bg-slate-950 shadow-2xl shadow-black/40">
				<div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
							Credential Details
						</p>
						<h2 className="text-lg font-bold text-white">{credential.achievementTitle || 'Credential'}</h2>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
					>
						Close
					</button>
				</div>

				<div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[320px_1fr]">
					<div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
						<div className="aspect-[4/5] bg-slate-900">
							{imageSource ? (
								<img src={imageSource} alt={credential.achievementTitle} className="h-full w-full object-cover" />
							) : (
								<div className="flex h-full items-center justify-center text-sm text-slate-400">No preview image</div>
							)}
						</div>
						<div className="border-t border-white/10 p-4">
							<p className={["inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]", credential.revoked ? 'border-rose-400/30 bg-rose-500/15 text-rose-200' : 'border-emerald-400/30 bg-emerald-500/15 text-emerald-200'].join(' ')}>
								{credential.revoked ? 'REVOKED' : 'VERIFIED'}
							</p>
							<p className="mt-3 text-sm text-slate-300">{credential.credentialTypeLabel}</p>
						</div>
					</div>

					<div className="space-y-4">
						<dl className="grid gap-3">
							<DetailRow label="Achievement Title" value={credential.achievementTitle} />
							<DetailRow label="Credential ID" value={credential.credentialId}>
								<div className="flex flex-wrap items-center gap-2">
									<span className="min-w-0 break-all">{credential.credentialId || 'N/A'}</span>
									<button
										type="button"
										onClick={() => copyText(credential.credentialId)}
										className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-100 transition hover:bg-white/10"
									>
										Copy Credential ID
									</button>
								</div>
							</DetailRow>
							<DetailRow label="Holder Address" value={credential.holder}>
								<div className="flex flex-wrap items-center gap-2">
									<span className="min-w-0 break-all">{credential.holder || 'N/A'}</span>
									<button
										type="button"
										onClick={() => copyText(credential.holder)}
										className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-100 transition hover:bg-white/10"
									>
										Copy Wallet Address
									</button>
								</div>
							</DetailRow>
							<DetailRow label="Issuer Name" value={credential.issuerName} />
							<DetailRow label="Issue Date" value={credential.issueDate} />
							<DetailRow label="Credential Type" value={credential.credentialTypeLabel} />
							<DetailRow label="Status" value={credential.revoked ? 'Revoked' : 'Verified'} />
							<DetailRow label="Metadata URI">
								{metadataLink ? (
									<a
										href={metadataLink}
										target="_blank"
										rel="noreferrer"
										className="break-all text-cyan-300 underline decoration-cyan-300/40 underline-offset-4 transition hover:text-cyan-200"
									>
										{metadataLink}
									</a>
								) : (
									<span>N/A</span>
								)}
							</DetailRow>
						</dl>
					</div>
				</div>
			</div>
		</div>
	)
}

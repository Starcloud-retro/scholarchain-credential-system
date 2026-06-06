function resolveImageSource(metadata) {
	const image = metadata?.image || metadata?.image_url || metadata?.imageUrl
	if (!image) return ''
	if (image.startsWith('ipfs://')) {
		return `https://ipfs.io/ipfs/${image.replace('ipfs://', '')}`
	}
	return image
}

function shortenAddress(address) {
	if (!address) return ''
	return `${address.slice(0, 6)}...${address.slice(-5)}`
}

export default function CredentialCard({ credential, onOpen }) {
	if (!credential) return null

	const imageSource = resolveImageSource(credential.metadata)
	const statusLabel = credential.revoked ? 'REVOKED' : 'VERIFIED'
	const statusClass = credential.revoked
		? 'border-rose-400/30 bg-rose-500/15 text-rose-200'
		: 'border-emerald-400/30 bg-emerald-500/15 text-emerald-200'
	const cardTitle = credential.achievementTitle || credential.metadata?.name || 'Credential'
	const holderLabel = shortenAddress(credential.holder)
	const issuerLabel = credential.issuerName || 'N/A'

	const handleCardOpen = () => {
		onOpen?.(credential)
	}

	return (
		<button
			type="button"
			onClick={handleCardOpen}
			className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/75 text-left shadow-2xl shadow-black/25 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-slate-900/90"
		>
			<div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
				{imageSource ? (
					<img src={imageSource} alt={cardTitle} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
				) : (
					<div className="flex h-full items-center justify-center bg-gradient-to-br from-cyan-400/20 to-emerald-400/20 text-sm font-semibold text-cyan-100">
						No preview image
					</div>
				)}
				<div className="absolute left-4 top-4 inline-flex rounded-full border border-white/10 bg-slate-950/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-100">
					{holderLabel}
				</div>
				<div className={[
					'absolute right-4 top-4 inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em]',
					statusClass,
				].join(' ')}>
					{statusLabel}
				</div>
			</div>

			<div className="space-y-3 p-5">
				<div className="space-y-1">
					<h2 className="truncate text-lg font-black text-white" title={cardTitle}>
						{cardTitle}
					</h2>
					<p className="truncate text-sm text-slate-300" title={credential.issuerName}>
						{issuerLabel}
					</p>
				</div>

				<div className="grid gap-3">
					<div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
						<span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Type</span>
						<span className="truncate text-sm font-semibold text-slate-100" title={credential.credentialTypeLabel}>
							{credential.credentialTypeLabel}
						</span>
					</div>
					<div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
						<span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Issue Date</span>
						<span className="truncate text-sm font-semibold text-slate-100" title={credential.issueDate}>
							{credential.issueDate || 'N/A'}
						</span>
					</div>
					<div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
						<span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Wallet</span>
						<span className="truncate text-sm font-semibold text-slate-100" title={credential.holder}>
							{holderLabel || 'N/A'}
						</span>
					</div>
				</div>

				<div className="flex items-center justify-between gap-3 pt-2">
					<span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">View full details</span>
					<span className="rounded-lg border border-cyan-300/25 bg-cyan-400/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200 transition group-hover:bg-cyan-400/20">
						View Details
					</span>
				</div>
			</div>
		</button>
	)
}

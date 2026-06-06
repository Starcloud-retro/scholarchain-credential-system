const features = [
	{
		title: 'Tamper-Proof Credentials',
		body: 'Academic achievements are issued as blockchain-backed credentials so records remain verifiable and immutable.',
	},
	{
		title: 'Institution-Grade Trust',
		body: 'Every credential includes issuer identity, issue date, type, and metadata, creating trusted digital proofs.',
	},
	{
		title: 'Fast Public Verification',
		body: 'Anyone can validate credentials instantly with a token ID, reducing fraud and manual verification delays.',
	},
]

export default function Home({ walletState }) {
	void walletState

	return (
		<div className="space-y-10">
			<section className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 px-6 py-16 shadow-2xl shadow-cyan-900/20 sm:px-10">
				<div className="absolute right-0 top-0 h-56 w-56 translate-x-16 -translate-y-16 rounded-full bg-cyan-400/20 blur-3xl" />
				<div className="relative mx-auto max-w-3xl text-center">
					<p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
						Decentralized Academic Trust Layer
					</p>
					<h1 className="text-balance text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
						ScholarChain Credential Verification
					</h1>
					<p className="mx-auto mt-5 max-w-2xl text-base text-slate-300 sm:text-lg">
						Issue and verify blockchain-based academic credentials with full
						transparency, cryptographic ownership, and instant authenticity
						checks.
					</p>
					<p className="mt-8 text-sm text-slate-400">
						Use the wallet controls in the top navigation to connect, switch,
						or disconnect.
					</p>
				</div>
			</section>

			<section className="grid gap-4 md:grid-cols-3">
				{features.map((item) => (
					<article
						key={item.title}
						className="rounded-2xl border border-white/10 bg-white/5 p-6"
					>
						<h2 className="text-lg font-bold text-white">{item.title}</h2>
						<p className="mt-2 text-sm leading-6 text-slate-300">{item.body}</p>
					</article>
				))}
			</section>
		</div>
	)
}

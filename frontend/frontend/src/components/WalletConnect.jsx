import { useState } from 'react'
import { connectWallet } from '../contracts/ScholarChainService'

function shortenAddress(address) {
	if (!address) return ''
	return `${address.slice(0, 6)}...${address.slice(-5)}`
}

export default function WalletConnect({
	account,
	organizationLabel = '',
	onConnected,
	onSwitchAccount,
	onDisconnected,
	className = '',
	buttonClassName = '',
}) {
	const [isConnecting, setIsConnecting] = useState(false)

	const handleConnect = async () => {
		setIsConnecting(true)
		try {
			const result = await connectWallet()
			onConnected?.(result)
		} catch (error) {
			alert(error.message || 'Failed to connect wallet')
		} finally {
			setIsConnecting(false)
		}
	}

	const handleDisconnect = () => {
		onDisconnected?.()
	}

	const handleSwitchAccount = () => {
		onSwitchAccount?.()
	}

	if (account) {
		return (
			<div className={['flex flex-col gap-3', className].join(' ')}>
				<div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-lg shadow-black/10">
					<p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
						{organizationLabel || 'Issuer Wallet'}
					</p>
					<p className="mt-1 text-sm font-semibold text-cyan-200">
						{shortenAddress(account)}
					</p>
				</div>
				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={handleSwitchAccount}
						className={[
							'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition',
							'border border-cyan-300/25 bg-cyan-400/10 text-cyan-100 hover:bg-cyan-400/20',
							buttonClassName,
						].join(' ')}
					>
						Switch Account
					</button>
					<button
						type="button"
						onClick={handleDisconnect}
						className={[
							'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition',
							'border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10',
							buttonClassName,
						].join(' ')}
					>
						Disconnect Wallet
					</button>
				</div>
			</div>
		)
	}

	return (
		<button
			type="button"
			onClick={handleConnect}
			disabled={isConnecting}
			className={[
				'inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition',
				'bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 shadow-lg shadow-cyan-500/20',
				'hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70',
				buttonClassName,
				className,
			].join(' ')}
		>
			{isConnecting ? 'Connecting...' : 'Connect Wallet'}
		</button>
	)
}

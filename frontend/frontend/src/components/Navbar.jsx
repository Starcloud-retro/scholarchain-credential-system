import { Link, NavLink } from 'react-router-dom'
import WalletConnect from './WalletConnect'

function navClass({ isActive }) {
	return [
		'rounded-lg px-3 py-2 text-sm font-medium transition',
		isActive
			? 'bg-cyan-400/20 text-cyan-300'
			: 'text-slate-300 hover:bg-white/5 hover:text-white',
	].join(' ')
}

export default function Navbar({ walletState }) {
	const {
		account,
		isAuthorizedIssuerRole,
		isContractOwner,
		organizationLabel,
		handleConnectWallet,
		handleSwitchAccount,
		handleDisconnectWallet,
	} = walletState

	return (
		<header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
			<div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
				<Link to="/" className="text-xl font-bold tracking-tight text-white">
					ScholarChain
				</Link>

				<nav className="flex items-center gap-2">
					<NavLink to="/" className={navClass}>
						Home
					</NavLink>
					{isAuthorizedIssuerRole ? (
						<NavLink to="/issue" className={navClass}>
							Issue Credential
						</NavLink>
					) : null}
					<NavLink to="/dashboard" className={navClass}>
						My Credentials
					</NavLink>
					{isAuthorizedIssuerRole ? (
						<NavLink to="/issuer-dashboard" className={navClass}>
							Issuer Dashboard
						</NavLink>
					) : null}
					<NavLink to="/verify" className={navClass}>
						Verify Credential
					</NavLink>
				</nav>

				<WalletConnect
					account={account}
					organizationLabel={organizationLabel}
					onConnected={handleConnectWallet}
					onSwitchAccount={handleSwitchAccount}
					onDisconnected={handleDisconnectWallet}
					buttonClassName="px-4 py-2"
				/>
			</div>
		</header>
	)
}

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import IssueCredential from './pages/IssueCredential'
import VerifyCredential from './pages/VerifyCredential'
import MyCredentials from './pages/MyCredentials'
import AdminDashboard from './pages/AdminDashboard'
import {
	connectWallet,
	switchAccountPermissions,
	getOwner,
	isAuthorizedIssuer,
} from './contracts/ScholarChainService'
import { getIssuerOrganizationLabel } from './contracts/issuerOrganizations'

function App() {
	const [account, setAccount] = useState('')
	const [chainId, setChainId] = useState('')
	const [isWalletReady, setIsWalletReady] = useState(false)
	const [contractOwner, setContractOwner] = useState('')
	const [isAuthorizedIssuerRole, setIsAuthorizedIssuerRole] = useState(false)
	const [isContractOwner, setIsContractOwner] = useState(false)
	const [organizationLabel, setOrganizationLabel] = useState('')

	const refreshWalletState = async () => {
		if (!window.ethereum) return

		const providerAccounts = await window.ethereum.request({ method: 'eth_accounts' })
		const currentChainId = await window.ethereum.request({ method: 'eth_chainId' })

		setAccount(providerAccounts?.[0] || '')
		setChainId(currentChainId || '')
	}

	useEffect(() => {
		if (!window.ethereum) return undefined

		const handleAccountsChanged = (accounts) => {
			setAccount(accounts?.[0] || '')
			window.ethereum
				.request({ method: 'eth_chainId' })
				.then((currentChainId) => setChainId(currentChainId || ''))
				.catch(() => setChainId(''))
		}

		const handleChainChanged = () => {
			refreshWalletState().catch(() => {
				setAccount('')
				setChainId('')
			})
		}

		window.ethereum.on('accountsChanged', handleAccountsChanged)
		window.ethereum.on('chainChanged', handleChainChanged)

		const bootstrapWalletState = async () => {
			try {
				await refreshWalletState()
			} catch {
				setAccount('')
				setChainId('')
			} finally {
				setIsWalletReady(true)
			}
		}

		void bootstrapWalletState()

		return () => {
			window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
			window.ethereum.removeListener('chainChanged', handleChainChanged)
		}
	}, [])

	useEffect(() => {
		let mounted = true

		const loadRoleState = async () => {
			if (!account) {
				setContractOwner('')
				setIsAuthorizedIssuerRole(false)
				setIsContractOwner(false)
				setOrganizationLabel('')
				return
			}

			try {
				const [ownerAddress, issuerRole] = await Promise.all([
					getOwner(),
					isAuthorizedIssuer(account),
				])

				if (!mounted) return

				const normalizedAccount = account.toLowerCase()
				const normalizedOwner = ownerAddress.toLowerCase()
				const ownerMatch = normalizedAccount === normalizedOwner
				const authorizedIssuer = issuerRole || ownerMatch

				setContractOwner(ownerAddress)
				setIsContractOwner(ownerMatch)
				setIsAuthorizedIssuerRole(authorizedIssuer)
				setOrganizationLabel(
					ownerMatch
						? 'Contract Owner'
						: getIssuerOrganizationLabel(account) ||
							(authorizedIssuer ? 'Authorized Issuer' : ''),
				)
			} catch {
				if (!mounted) return
				setContractOwner('')
				setIsAuthorizedIssuerRole(false)
				setIsContractOwner(false)
				setOrganizationLabel('')
			}
		}

		void loadRoleState()

		return () => {
			mounted = false
		}
	}, [account])

	const handleConnectWallet = async () => {
		const result = await connectWallet()
		setAccount(result.account)
		setChainId(result.chainId)
	}

	const handleSwitchAccount = async () => {
		const result = await switchAccountPermissions()
		setAccount(result.account)
		setChainId(result.chainId)
	}

	const handleDisconnectWallet = () => {
		setAccount('')
		setChainId('')
	}

	const walletState = useMemo(
		() => ({
			account,
			setAccount,
			chainId,
			setChainId,
			isWalletReady,
			contractOwner,
			isAuthorizedIssuerRole,
			isContractOwner,
			organizationLabel,
			handleConnectWallet,
			handleSwitchAccount,
			handleDisconnectWallet,
		}),
		[
			account,
			chainId,
			isWalletReady,
			contractOwner,
			isAuthorizedIssuerRole,
			isContractOwner,
			organizationLabel,
		],
	)

	return (
		<BrowserRouter>
			<div className="min-h-screen bg-slate-950 text-slate-100">
				<div className="absolute inset-0 -z-10 overflow-hidden">
					<div className="absolute left-[-8rem] top-[-10rem] h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
					<div className="absolute right-[-7rem] top-20 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
					<div className="absolute bottom-0 left-1/2 h-72 w-[34rem] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
				</div>

				<Navbar walletState={walletState} />

				<main className="mx-auto w-full max-w-7xl px-4 pb-14 pt-8 sm:px-6 lg:px-8">
					<Routes>
						<Route path="/" element={<Home walletState={walletState} />} />
						<Route path="/issue" element={<IssueCredential walletState={walletState} />} />
						<Route path="/verify" element={<VerifyCredential />} />
						<Route path="/dashboard" element={<MyCredentials walletState={walletState} />} />
						<Route path="/issuer-dashboard" element={<AdminDashboard walletState={walletState} />} />
						<Route path="/admin" element={<Navigate to="/issuer-dashboard" replace />} />
						<Route path="*" element={<Navigate to="/" replace />} />
					</Routes>
				</main>
			</div>
		</BrowserRouter>
	)
}

export default App

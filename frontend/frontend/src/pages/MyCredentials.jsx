import { useEffect, useMemo, useState } from 'react'
import CredentialCard from '../components/CredentialCard'
import CredentialDetailsModal from '../components/CredentialDetailsModal'
import {
    getTokensOfOwner,
    getCredential,
    fetchCredentialMetadata,
} from '../contracts/ScholarChainService'

export default function MyCredentials({ walletState }) {
    const { account } = walletState
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [credentials, setCredentials] = useState([])
    const [selectedCredential, setSelectedCredential] = useState(null)

    const selectedCredentialWithImage = useMemo(() => {
        if (!selectedCredential) return null

        return {
            ...selectedCredential,
            imageSource:
                selectedCredential.metadata?.image ||
                selectedCredential.metadata?.image_url ||
                selectedCredential.metadata?.imageUrl ||
                '',
        }
    }, [selectedCredential])

    useEffect(() => {
        let mounted = true
        const load = async () => {
            setError('')
            setCredentials([])
            setSelectedCredential(null)

            if (!account) return

            setLoading(true)
            try {
                const tokenIds = await getTokensOfOwner(account)
                if (!tokenIds.length) {
                    if (mounted) setCredentials([])
                    return
                }

                const items = await Promise.all(
                    tokenIds.map(async (id) => {
                        const credential = await getCredential(id)
                        try {
                            const metadata = await fetchCredentialMetadata(credential.metadataURI)
                            credential.metadata = metadata
                        } catch {
                            credential.metadata = null
                        }
                        return credential
                    }),
                )

                if (mounted) setCredentials(items)
            } catch (e) {
                if (mounted) setError(e.message || 'Failed to load credentials')
            } finally {
                if (mounted) setLoading(false)
            }
        }

        void load()

        return () => {
            mounted = false
        }
    }, [account])

    return (
        <section className="mx-auto max-w-7xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">My Credentials</h1>
                <p className="mt-1 text-sm text-slate-300">
                    Browse credentials owned by the wallet connected in the top navigation.
                </p>
            </div>

            {!account ? (
                <p className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                    Connect your wallet to view your credentials.
                </p>
            ) : null}

            {error ? (
                <p className="mt-4 rounded-lg border border-rose-300/40 bg-rose-500/10 p-3 text-sm text-rose-200">
                    {error}
                </p>
            ) : null}

            {loading ? (
                <p className="mt-4 text-sm text-slate-300">Loading credentials...</p>
            ) : null}

            {!loading && account && credentials.length === 0 ? (
                <p className="mt-4 rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                    No credentials found for {account}.
                </p>
            ) : null}

            <div className="mt-6 grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {credentials.map((c) => (
                    <CredentialCard
                        key={c.tokenId}
                        credential={c}
                        onOpen={setSelectedCredential}
                    />
                ))}
            </div>

            {selectedCredentialWithImage ? (
                <CredentialDetailsModal
                    credential={selectedCredentialWithImage}
                    onClose={() => setSelectedCredential(null)}
                />
            ) : null}
        </section>
    )
}

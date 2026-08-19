import { useState, useEffect, useCallback, useRef } from 'react'
import * as StellarSdk from '@stellar/stellar-sdk'
import * as SorobanRpc from '@stellar/stellar-sdk/rpc'
import {
  initWalletKit,
  connectWallet,
  getActiveAddress,
  onWalletChange,
  disconnectWallet,
  signTransaction,
} from '../lib/wallet'
import {
  getProgress,
  getDonors,
  getAdmin,
  buildDonateTx,
  submitSignedTx,
  pollTxResult,
  getEvents,
  fetchLatestLedger,
} from '../lib/contract'
import { stroopsToXlm, NETWORK_PASSPHRASE, RPC_URL, CONTRACT_ID } from '../lib/config'

export function useCrowdfund() {
  const [address, setAddress] = useState(null)
  const [admin, setAdmin] = useState(null)
  const [progress, setProgress] = useState({ total: 0n, goal: 100_000_000n })
  const [donors, setDonors] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDonating, setIsDonating] = useState(false)
  const [txStatus, setTxStatus] = useState(null)
  const [txHash, setTxHash] = useState(null)
  const [txError, setTxError] = useState(null)
  const [toast, setToast] = useState(null)
  const [isWithdrawing, setIsWithdrawing] = useState(false)

  const latestLedgerRef = useRef(null)
  const pollingRef = useRef(null)

  useEffect(() => {
    initWalletKit()
    getActiveAddress().then(addr => {
      if (addr) setAddress(addr)
    })
    const unsub = onWalletChange(addr => {
      setAddress(addr)
    })
    return () => {
      if (typeof unsub === 'function') unsub()
    }
  }, [])

  const refreshCampaign = useCallback(async () => {
    try {
      const [progressData, donorsData, adminAddr] = await Promise.all([
        getProgress(),
        getDonors(),
        getAdmin(),
      ])
      setProgress(progressData)
      setDonors(donorsData.sort((a, b) => Number(b.amount - a.amount)))
      setAdmin(adminAddr)
    } catch (err) {
      console.error('Failed to load campaign:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshCampaign()
  }, [refreshCampaign])

  useEffect(() => {
    fetchLatestLedger()
      .then(ledger => {
        latestLedgerRef.current = ledger
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const pollEvents = async () => {
      if (!latestLedgerRef.current) return
      try {
        const { events, latestLedger } = await getEvents(latestLedgerRef.current)
        if (events && events.length > 0) {
          refreshCampaign()
        }
        latestLedgerRef.current = latestLedger
      } catch {
        // silently retry
      }
    }

    pollingRef.current = setInterval(pollEvents, 5000)
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [refreshCampaign])

  const handleConnect = useCallback(async () => {
    try {
      const addr = await connectWallet()
      setAddress(addr)
    } catch (err) {
      if (err?.code === -1) return
      showToast('error', err?.message || 'Failed to connect wallet')
    }
  }, [])

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnectWallet()
      setAddress(null)
    } catch {
      // ignore
    }
  }, [])

  const handleDonate = useCallback(
    async (amountXlm) => {
      if (!address) {
        showToast('error', 'Wallet not connected')
        return
      }

      const numAmount = parseFloat(amountXlm)
      if (isNaN(numAmount) || numAmount <= 0) {
        showToast('error', 'Enter a valid amount')
        return
      }

      setIsDonating(true)
      setTxStatus('pending')
      setTxHash(null)
      setTxError(null)

      try {
        const tx = buildDonateTx(address, numAmount)
        const server = new SorobanRpc.Server(RPC_URL)
        const prepared = await server.prepareTransaction(tx)
        const preparedXdr = prepared.toXDR()
        const { signedXdr } = await signTransaction(preparedXdr)

        const sendResult = await submitSignedTx(signedXdr)
        setTxHash(sendResult.hash)

        const result = await pollTxResult(sendResult.hash)
        if (result?.status === 'SUCCESS') {
          setTxStatus('success')
          showToast('success', `Donation of ${numAmount} XLM confirmed!`)
          refreshCampaign()
        } else {
          setTxStatus('error')
          setTxError(result?.statusXdr || 'Transaction failed')
          showToast('error', 'Transaction failed on-chain')
        }
      } catch (err) {
        console.error('Donate error:', err)
        setTxStatus('error')

        if (err?.message?.includes('reject') || err?.message?.includes('denied') || err?.message?.includes('cancel')) {
          setTxError('Transaction rejected by user')
          showToast('info', 'You rejected the transaction')
        } else if (err?.code === -3) {
          setTxError(err.message)
          showToast('error', err.message)
        } else {
          setTxError(err?.message || 'Transaction failed')
          showToast('error', err?.message || 'Transaction failed')
        }
      } finally {
        setIsDonating(false)
      }
    },
    [address, refreshCampaign]
  )

  const handleWithdraw = useCallback(async () => {
    if (!address) {
      showToast('error', 'Wallet not connected')
      return
    }

    if (address !== admin) {
      showToast('error', 'Only the admin can withdraw')
      return
    }

    if (progress.total < progress.goal) {
      showToast('error', 'Goal not yet reached')
      return
    }

    setIsWithdrawing(true)
    setTxStatus('pending')
    setTxHash(null)
    setTxError(null)

    try {
      const server = new SorobanRpc.Server(RPC_URL)
      const account = await server.getAccount(address)
      const contract = new StellarSdk.Contract(CONTRACT_ID)

      const tx = new StellarSdk.TransactionBuilder(account, {
        fee: '100000',
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(contract.call('withdraw', StellarSdk.Address.fromString(address).toScVal()))
        .setTimeout(300)
        .build()

      const prepared = await server.prepareTransaction(tx)
      const { signedXdr } = await signTransaction(prepared.toXDR())

      const sendResult = await submitSignedTx(signedXdr)
      setTxHash(sendResult.hash)

      const result = await pollTxResult(sendResult.hash)
      if (result?.status === 'SUCCESS') {
        setTxStatus('success')
        showToast('success', 'Funds withdrawn successfully!')
        refreshCampaign()
      } else {
        setTxStatus('error')
        setTxError(result?.statusXdr || 'Withdrawal failed')
        showToast('error', 'Withdrawal failed')
      }
    } catch (err) {
      setTxStatus('error')
      setTxError(err?.message || 'Withdrawal failed')
      showToast('error', err?.message || 'Withdrawal failed')
    } finally {
      setIsWithdrawing(false)
    }
  }, [address, admin, progress, refreshCampaign])

  const showToast = useCallback((type, message) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 5000)
  }, [])

  const clearTxStatus = useCallback(() => {
    setTxStatus(null)
    setTxHash(null)
    setTxError(null)
  }, [])

  return {
    address,
    admin,
    progress,
    donors,
    loading,
    isDonating,
    isWithdrawing,
    txStatus,
    txHash,
    txError,
    toast,
    isAdmin: address && admin && address === admin,
    progressPercent: progress.goal > 0n
      ? Math.min(100, Number((progress.total * 10000n) / progress.goal) / 100)
      : 0,
    handleConnect,
    handleDisconnect,
    handleDonate,
    handleWithdraw,
    clearTxStatus,
    showToast,
    stroopsToXlm,
  }
}

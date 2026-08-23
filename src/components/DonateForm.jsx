import { useState } from 'react'
import { Send, Loader2, AlertCircle } from 'lucide-react'

export function DonateForm({ address, balance, isDonating, onDonate }) {
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!address) {
      setError('Connect your wallet first')
      return
    }

    const num = parseFloat(amount)
    if (isNaN(num) || num <= 0) {
      setError('Enter a valid XLM amount')
      return
    }

    if (num > 10000) {
      setError('Maximum donation is 10,000 XLM')
      return
    }

    if (balance != null && num > balance - 0.01) {
      setError(
        `Insufficient balance — you have ${balance.toFixed(2)} XLM available`
      )
      return
    }

    onDonate(amount)
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#050505]/80 p-6 backdrop-blur-md">
      <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.16rem] text-zinc-500 mb-4">
        Donate XLM
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-medium text-zinc-400">Amount (XLM)</label>
            {address && balance != null && (
              <span className="text-[11px] font-mono text-zinc-500">
                Balance: {balance.toFixed(2)} XLM
              </span>
            )}
          </div>
          <input
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value)
              setError('')
            }}
            disabled={isDonating}
            placeholder="0.00"
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white font-mono placeholder-zinc-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-colors disabled:opacity-50"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs text-red-400 animate-slideDown">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isDonating || !address}
          className="w-full flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white px-6 py-3.5 text-sm font-semibold text-[#030303] transition-all duration-300 hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isDonating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Donate
            </>
          )}
        </button>

        {!address && (
          <p className="text-center text-xs text-zinc-600">
            Connect your wallet to donate
          </p>
        )}
      </form>
    </div>
  )
}

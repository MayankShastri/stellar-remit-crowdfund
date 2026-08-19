import { CheckCircle, XCircle, Loader2, ExternalLink, X } from 'lucide-react'
import { EXPLORER_BASE } from '../lib/config'

export function TxStatus({ status, txHash, error, onClose }) {
  if (!status) return null

  return (
    <div className="mb-6 animate-slideDown">
      <div
        className={`relative overflow-hidden rounded-xl border p-4 flex items-center justify-between backdrop-blur-md ${
          status === 'pending'
            ? 'bg-blue-500/[0.06] border-blue-500/30'
            : status === 'success'
            ? 'bg-emerald-500/[0.06] border-emerald-500/30'
            : 'bg-red-500/[0.06] border-red-500/30'
        }`}
      >
        <div className="flex items-center gap-3">
          {status === 'pending' && <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />}
          {status === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
          {status === 'error' && <XCircle className="w-4 h-4 text-red-400" />}

          <div>
            <p className="text-sm font-medium text-white">
              {status === 'pending' && 'Transaction pending...'}
              {status === 'success' && 'Transaction confirmed'}
              {status === 'error' && (error || 'Transaction failed')}
            </p>
            {txHash && (
              <a
                href={`${EXPLORER_BASE}/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors mt-1"
              >
                {txHash.slice(0, 12)}...
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-zinc-500 hover:text-white transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

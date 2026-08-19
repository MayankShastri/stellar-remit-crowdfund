import { Loader2, AlertTriangle } from 'lucide-react'

export function AdminPanel({ address, admin, isWithdrawing, progress, goal, onWithdraw }) {
  const isAdmin = address && admin && address === admin
  const goalReached = progress >= goal

  if (!address) return null

  return (
    <div className="rounded-2xl border border-white/10 bg-[#050505]/80 p-6 backdrop-blur-md">
      <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.16rem] text-zinc-500 mb-4">
        Admin Panel
      </h3>

      {!isAdmin ? (
        <p className="text-sm text-zinc-500">
          Connected as <span className="font-mono text-zinc-400">{address.slice(0, 6)}...{address.slice(-4)}</span>
          <br />
          <span className="text-xs text-zinc-600">Only the campaign admin can withdraw funds.</span>
        </p>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-emerald-500/80">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            You are the admin
          </div>

          {!goalReached ? (
            <div className="flex items-center gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/[0.04] px-3 py-2">
              <AlertTriangle className="w-3.5 h-3.5 text-yellow-500/70" />
              <span className="text-xs text-yellow-500/80">Goal not yet reached</span>
            </div>
          ) : (
            <button
              onClick={onWithdraw}
              disabled={isWithdrawing}
              className="w-full flex items-center justify-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-6 py-3 text-sm font-semibold text-emerald-400 transition-all duration-300 hover:bg-emerald-500/20 disabled:opacity-40"
            >
              {isWithdrawing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Withdrawing...
                </>
              ) : (
                'Withdraw Funds'
              )}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

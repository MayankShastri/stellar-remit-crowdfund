import { Users, ExternalLink } from 'lucide-react'
import { EXPLORER_BASE } from '../lib/config'

export function DonorList({ donors, stroopsToXlm, address }) {
  const truncate = (addr) => addr.slice(0, 6) + '...' + addr.slice(-4)

  return (
    <div className="rounded-2xl border border-white/10 bg-[#050505]/80 p-6 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.16rem] text-zinc-500">
          Donors
        </h3>
        <span className="font-mono text-xs text-zinc-600">
          {donors.length} {donors.length === 1 ? 'donor' : 'donors'}
        </span>
      </div>

      {donors.length === 0 ? (
        <div className="text-center py-8">
          <Users className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
          <p className="text-sm text-zinc-600">No donations yet. Be the first!</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {donors.map((donor, i) => (
            <div
              key={donor.address + i}
              className={`flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3 transition-all hover:border-white/15 ${
                donor.address === address ? 'border-emerald-500/30 bg-emerald-500/[0.04]' : ''
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-8 rounded-full bg-white/[0.06] border border-white/10 grid place-items-center text-[10px] font-mono font-bold text-zinc-400">
                  {i + 1}
                </div>
                <div className="min-w-0">
                  <a
                    href={`${EXPLORER_BASE}/account/${donor.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
                  >
                    {truncate(donor.address)}
                    <ExternalLink className="w-3 h-3 shrink-0 text-zinc-600" />
                  </a>
                  {donor.address === address && (
                    <span className="text-[10px] font-mono text-emerald-500/70">you</span>
                  )}
                </div>
              </div>
              <span className="font-mono text-sm text-white font-medium tabular-nums">
                {stroopsToXlm(donor.amount).toLocaleString()} XLM
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

import { Target, TrendingUp } from 'lucide-react'

export function CrowdfundHero({ progressPercent, total, goal, loading, stroopsToXlm }) {
  const totalXlm = stroopsToXlm(total)
  const goalXlm = stroopsToXlm(goal)

  return (
    <section id="home" className="relative px-4 pt-28 sm:pt-32 pb-6">
      <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-[#030303]/40 p-6 backdrop-blur-md sm:p-8 lg:p-12 relative">
        <div className="relative z-10 text-center max-w-3xl mx-auto py-8 sm:py-12">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-3 py-1.5 text-xs font-semibold font-mono uppercase tracking-[0.18rem] text-zinc-300">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse-subtle" />
            Stellar Testnet · Soroban Contract
          </div>

          <h1 className="max-w-3xl mx-auto text-4xl font-bold leading-[0.98] tracking-tighter text-white sm:text-5xl md:text-6xl">
            Stellar Remit - Crowdfund
          </h1>

          <p className="mt-7 max-w-xl mx-auto text-base leading-7 text-zinc-400 sm:text-lg">
            Donate XLM to a Soroban-powered crowdfunding campaign. Smart contract escrow with transparent on-chain tracking.
          </p>

          {/* Progress Bar */}
          <div className="mt-10 max-w-md mx-auto">
            <div className="flex justify-between items-baseline mb-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-zinc-500" />
                <span className="font-mono text-xs text-zinc-500 uppercase tracking-wider">Campaign Goal</span>
              </div>
              <span className="font-mono text-xs text-zinc-500">
                {loading ? '—' : `${Math.round(progressPercent)}%`}
              </span>
            </div>

            <div className="h-3 rounded-full bg-white/[0.06] border border-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500/80 to-emerald-400 transition-all duration-1000 ease-out"
                style={{ width: loading ? '0%' : `${Math.min(100, progressPercent)}%` }}
              />
            </div>

            <div className="flex justify-between mt-3">
              <span className="font-mono text-sm text-white font-medium">
                {loading ? '...' : `${totalXlm.toLocaleString()} XLM`}
              </span>
              <span className="font-mono text-sm text-zinc-500">
                {loading ? '...' : `of ${goalXlm.toLocaleString()} XLM`}
              </span>
            </div>
          </div>

          {/* Steps */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto text-left">
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Step 01</p>
              <p className="mt-1 text-xs text-zinc-300 font-medium">Connect Wallet</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Step 02</p>
              <p className="mt-1 text-xs text-zinc-300 font-medium">Enter Amount</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Step 03</p>
              <p className="mt-1 text-xs text-zinc-300 font-medium">Sign & Donate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

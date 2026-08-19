import { Wallet, LogOut, Copy, Check } from 'lucide-react'
import { useState } from 'react'

export function WalletConnect({ address, onConnect, onDisconnect }) {
  const [copied, setCopied] = useState(false)

  const truncate = (addr) => addr.slice(0, 6) + '...' + addr.slice(-4)

  const copyAddress = () => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (address) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={copyAddress}
          className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-mono text-zinc-300 transition-all hover:border-white/30 hover:bg-white/[0.08]"
          title="Copy address"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{truncate(address)}</span>
        </button>
        <button
          onClick={onDisconnect}
          className="rounded-lg border border-white/10 bg-white/[0.03] p-2 text-zinc-400 transition-all hover:border-red-500/30 hover:text-red-400"
          title="Disconnect"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={onConnect}
      className="group flex items-center gap-2 rounded-full border border-white/30 bg-white px-4 py-2 text-xs font-semibold text-[#030303] transition-all duration-300 hover:bg-zinc-200"
    >
      <Wallet className="w-3.5 h-3.5" />
      Connect Wallet
    </button>
  )
}

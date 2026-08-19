import { CheckCircle, XCircle, Info, X } from 'lucide-react'

export function Toast({ toast }) {
  if (!toast) return null

  const icons = {
    success: <CheckCircle className="w-4 h-4 text-emerald-400" />,
    error: <XCircle className="w-4 h-4 text-red-400" />,
    info: <Info className="w-4 h-4 text-blue-400" />,
  }

  const borders = {
    success: 'border-emerald-500/30',
    error: 'border-red-500/30',
    info: 'border-blue-500/30',
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slideUp">
      <div
        className={`flex items-center gap-3 rounded-xl border bg-[#0a0a0a]/95 px-4 py-3 backdrop-blur-xl shadow-2xl ${
          borders[toast.type] || borders.info
        }`}
      >
        {icons[toast.type] || icons.info}
        <span className="text-sm text-zinc-200">{toast.message}</span>
      </div>
    </div>
  )
}

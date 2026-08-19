import React from 'react'
import { useCrowdfund } from './hooks/useCrowdfund'
import { WalletConnect } from './components/WalletConnect'
import { CrowdfundHero } from './components/CrowdfundHero'
import { DonateForm } from './components/DonateForm'
import { DonorList } from './components/DonorList'
import { TxStatus } from './components/TxStatus'
import { Toast } from './components/Toast'
import { AdminPanel } from './components/AdminPanel'
import { ArrowRight, ExternalLink } from 'lucide-react'

export default function App() {
  const {
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
    progressPercent,
    handleConnect,
    handleDisconnect,
    handleDonate,
    handleWithdraw,
    clearTxStatus,
    stroopsToXlm,
  } = useCrowdfund()

  return (
    <div className="relative min-h-screen bg-[#030303] text-white flex flex-col selection:bg-white/20 selection:text-white antialiased">
      <a
        href="#console"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-[#030303]"
      >
        Skip to content
      </a>

      {/* Floating Nav */}
      <header className="fixed left-0 right-0 top-4 sm:top-5 z-50 px-4">
        <nav
          className="mx-auto flex max-w-4xl items-center justify-between rounded-xl border border-white/10 bg-[#070707]/80 p-1.5 backdrop-blur-xl"
          aria-label="Primary navigation"
        >
          <a
            href="#home"
            className="group flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 transition-all duration-300 hover:border-white/30 hover:bg-white/[0.08]"
          >
            <span className="grid size-7 place-items-center rounded-md bg-white text-[#030303] text-xs font-bold font-mono tracking-tighter">
              SR
            </span>
            <span className="text-sm font-medium tracking-tight text-white">
              Stellar Remit
            </span>
          </a>

          <WalletConnect
            address={address}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
          />
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1">
        <CrowdfundHero
          progressPercent={progressPercent}
          total={progress.total}
          goal={progress.goal}
          loading={loading}
          stroopsToXlm={stroopsToXlm}
        />

        {/* Console Section */}
        <section id="console" className="px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <TxStatus
              status={txStatus}
              txHash={txHash}
              error={txError}
              onClose={clearTxStatus}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                <DonateForm
                  address={address}
                  isDonating={isDonating}
                  onDonate={handleDonate}
                />
                <AdminPanel
                  address={address}
                  admin={admin}
                  isWithdrawing={isWithdrawing}
                  progress={progress.total}
                  goal={progress.goal}
                  onWithdraw={handleWithdraw}
                />
              </div>

              <div>
                <DonorList
                  donors={donors}
                  stroopsToXlm={stroopsToXlm}
                  address={address}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-4 pb-6 pt-4">
        <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-[#050505]/80 p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-md bg-white text-[#030303] text-xs font-bold font-mono tracking-tighter">
                  SR
                </span>
                <span className="text-lg font-medium tracking-tight text-white">
                  Stellar Remit
                </span>
              </div>
              <p className="mt-4 max-w-sm text-sm leading-6 text-zinc-500">
                Soroban-powered crowdfunding dApp with multi-wallet support, built for the Stellar Builder Challenge.
              </p>
            </div>

            <div>
              <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.16rem] text-zinc-500">
                Resources
              </h3>
              <div className="mt-4 space-y-3 text-sm text-zinc-400">
                <a href="https://developers.stellar.org/" target="_blank" rel="noopener noreferrer" className="block transition-colors hover:text-white">
                  Stellar Developers
                </a>
                <a href="https://soroban.stellar.org/" target="_blank" rel="noopener noreferrer" className="block transition-colors hover:text-white">
                  Soroban Docs
                </a>
                <a href="https://stellar.expert/explorer/testnet" target="_blank" rel="noopener noreferrer" className="block transition-colors hover:text-white">
                  StellarExpert
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.16rem] text-zinc-500">
                App
              </h3>
              <div className="mt-4 space-y-3 text-sm text-zinc-400">
                <a href="#console" className="block transition-colors hover:text-white">
                  Console
                </a>
                <a href="#home" className="block transition-colors hover:text-white">
                  Back to Top
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 font-mono text-xs text-zinc-600 sm:flex-row">
            <p>© 2026 Stellar Remit · Stellar Builder Challenge</p>
            <div className="flex gap-4">
              <a href="https://stellar.org" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-zinc-300">
                Stellar.org
              </a>
              <a href="https://github.com/MayankShastri/stellar-remit" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-zinc-300">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>

      <Toast toast={toast} />
    </div>
  )
}

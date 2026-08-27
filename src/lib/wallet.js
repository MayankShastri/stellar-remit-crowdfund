import { StellarWalletsKit } from '@creit.tech/stellar-wallets-kit'
import { FreighterModule } from '@creit.tech/stellar-wallets-kit/modules/freighter'
import { LobstrModule } from '@creit.tech/stellar-wallets-kit/modules/lobstr'
import { RabetModule } from '@creit.tech/stellar-wallets-kit/modules/rabet'
import { AlbedoModule } from '@creit.tech/stellar-wallets-kit/modules/albedo'
import { HanaModule } from '@creit.tech/stellar-wallets-kit/modules/hana'
import { NETWORK_PASSPHRASE } from './config'

export function initWalletKit() {
  StellarWalletsKit.init({
    selectedWalletId: undefined,
    network: NETWORK_PASSPHRASE,
    modules: [
      new FreighterModule(),
      new LobstrModule(),
      new RabetModule(),
      new AlbedoModule(),
      new HanaModule(),
    ],
  })
}

export async function connectWallet() {
  const { address } = await StellarWalletsKit.authModal()
  return address
}

export function getActiveAddress() {
  return StellarWalletsKit.getAddress().then(r => r.address).catch(() => null)
}

function normalizeSigned(result) {
  const signed =
    typeof result === 'string'
      ? result
      : result?.signedTxXdr ?? result?.signedXdr
  if (!signed) {
    throw new Error('Wallet returned no signed transaction')
  }
  return { signedXdr: signed, signerAddress: result?.signerAddress ?? null }
}

export async function signTransaction(xdr) {
  const result = await StellarWalletsKit.signTransaction(xdr, {
    networkPassphrase: NETWORK_PASSPHRASE,
  })
  return normalizeSigned(result)
}

export async function signAndSubmit(xdr) {
  const result = await StellarWalletsKit.signAndSubmitTransaction(xdr, {
    networkPassphrase: NETWORK_PASSPHRASE,
  })
  return normalizeSigned(result)
}

export function onWalletChange(callback) {
  return StellarWalletsKit.on('STATE_UPDATE', (event) => {
    callback(event.payload?.address || null)
  })
}

export function disconnectWallet() {
  return StellarWalletsKit.disconnect()
}

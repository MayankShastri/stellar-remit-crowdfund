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

export async function signTransaction(xdr) {
  return StellarWalletsKit.signTransaction(xdr, {
    networkPassphrase: NETWORK_PASSPHRASE,
  })
}

export async function signAndSubmit(xdr) {
  return StellarWalletsKit.signAndSubmitTransaction(xdr, {
    networkPassphrase: NETWORK_PASSPHRASE,
  })
}

export function onWalletChange(callback) {
  return StellarWalletsKit.on('STATE_UPDATE', (event) => {
    callback(event.payload?.address || null)
  })
}

export function disconnectWallet() {
  return StellarWalletsKit.disconnect()
}

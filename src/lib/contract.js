import * as SorobanRpc from '@stellar/stellar-sdk/rpc'
import * as StellarSdk from '@stellar/stellar-sdk'
import { CONTRACT_ID, RPC_URL, NETWORK_PASSPHRASE, xlmToStroops } from './config'

const server = new SorobanRpc.Server(RPC_URL, { allowHttp: false })
const HORIZON_URL = 'https://horizon-testnet.stellar.org'

export async function getXlmBalance(address) {
  const res = await fetch(`${HORIZON_URL}/accounts/${address}`)
  if (!res.ok) return null
  const data = await res.json()
  const native = data.balances?.find(b => b.asset_type === 'native')
  return native ? parseFloat(native.balance) : 0
}

export async function getProgress() {
  const account = await server.getAccount('GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWhf')
  const contract = new StellarSdk.Contract(CONTRACT_ID)
  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: '100',
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call('get_progress'))
    .setTimeout(30)
    .build()

  const result = await server.simulateTransaction(tx)
  if (SorobanRpc.Api.isSimulationError(result)) {
    throw new Error(result.error)
  }

  const retval = result.result?.retval
  if (!retval) return { total: 0n, goal: 0n }

  const parsed = StellarSdk.scValToNative(retval)
  return { total: BigInt(parsed[0]), goal: BigInt(parsed[1]) }
}

export async function getDonors() {
  const account = await server.getAccount('GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWhf')
  const contract = new StellarSdk.Contract(CONTRACT_ID)
  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: '100',
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call('get_donors'))
    .setTimeout(30)
    .build()

  const result = await server.simulateTransaction(tx)
  if (SorobanRpc.Api.isSimulationError(result)) {
    throw new Error(result.error)
  }

  const retval = result.result?.retval
  if (!retval) return []

  const parsed = StellarSdk.scValToNative(retval)
  return parsed.map(([addr, amount]) => ({
    address: addr.toString(),
    amount: BigInt(amount),
  }))
}

export async function getAdmin() {
  const account = await server.getAccount('GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWhf')
  const contract = new StellarSdk.Contract(CONTRACT_ID)
  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: '100',
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call('get_admin'))
    .setTimeout(30)
    .build()

  const result = await server.simulateTransaction(tx)
  if (SorobanRpc.Api.isSimulationError(result)) {
    throw new Error(result.error)
  }

  const retval = result.result?.retval
  if (!retval) return null

  return StellarSdk.scValToNative(retval).toString()
}

export function buildDonateTx(sourceAccount, amountXlm) {
  const amount = xlmToStroops(amountXlm)
  const account = new StellarSdk.Account(sourceAccount, '0')
  const contract = new StellarSdk.Contract(CONTRACT_ID)
  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: '100000',
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      contract.call(
        'donate',
        StellarSdk.Address.fromString(sourceAccount).toScVal(),
        StellarSdk.nativeToScVal(amount, { type: 'i128' })
      )
    )
    .setTimeout(300)
    .build()

  return tx
}

export async function prepareAndSign(sourceAccount, amountXlm) {
  const tx = buildDonateTx(sourceAccount, amountXlm)
  const prepared = await server.prepareTransaction(tx)
  const preparedXdr = prepared.toXDR()
  return preparedXdr
}

export async function submitSignedTx(signedXdr) {
  const tx = new StellarSdk.Transaction(signedXdr, NETWORK_PASSPHRASE)
  const result = await server.sendTransaction(tx)
  return result
}

export async function pollTxResult(hash, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const result = await server.getTransaction(hash)
      if (result.status === 'SUCCESS' || result.status === 'FAILED') {
        return result
      }
    } catch {
      // tx not indexed yet
    }
    await new Promise(r => setTimeout(r, 2000))
  }
  return null
}

export async function getEvents(startLedger) {
  const response = await server.getEvents({
    startLedger,
    filters: [
      {
        type: 'contract',
        contractIds: [CONTRACT_ID],
      },
    ],
    limit: 100,
  })

  return {
    events: response.events,
    latestLedger: response.latestLedger,
  }
}

export async function fetchLatestLedger() {
  const latest = await server.getLatestLedger()
  return latest.sequence
}

export const CONTRACT_ID = 'CDI3URZZQOOKNUEEJXACSOU6KVE6IFQ6CGPBSYMPBILPTQFSR6FFURCU'
export const RPC_URL = 'https://soroban-testnet.stellar.org'
export const NETWORK_PASSPHRASE = 'Test SDF Network ; September 2015'
export const EXPLORER_BASE = 'https://stellar.expert/explorer/testnet'
export const XLM_ENDPOINT = 'https://soroban-testnet.stellar.org'

export function stroopsToXlm(stroops) {
  return Number(stroops) / 10_000_000
}

export function xlmToStroops(xlm) {
  return BigInt(Math.round(Number(xlm) * 10_000_000))
}

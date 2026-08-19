# Stellar Remit - Crowdfund

A Soroban-powered crowdfunding dApp built for the Stellar Journey to Mastery (Yellow Belt / Level 2).

## Features

- **Smart Contract Escrow**: Soroban contract manages donations, tracks per-donor amounts, and handles admin withdrawals
- **Multi-Wallet Support**: Connect with Freighter, LOBSTR, Rabet, Albedo, Hana via StellarWalletsKit
- **Real-Time Updates**: Event polling every 5s with ledger cursor tracking
- **Transaction Status**: Pending → Success/Error with Stellar Expert explorer links
- **Admin Withdrawal**: Campaign admin can withdraw funds only after goal is reached

## Smart Contract

**Contract Address**: `CDI3URZZQOOKNUEEJXACSOU6KVE6IFQ6CGPBSYMPBILPTQFSR6FFURCU`

**Deploy Transaction**: [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/db19d9a113c5188771f3eac2274d4f00bcb0f05e2f200dc416039bc156503ecf)

### Contract Functions
| Function | Description |
|----------|-------------|
| `initialize(admin, goal)` | Set admin and funding goal (one-time) |
| `donate(donor, amount)` | Donate XLM to the campaign |
| `withdraw(admin)` | Admin withdrawal (only after goal reached) |
| `get_progress()` | Returns (total_raised, goal) |
| `get_donors()` | Returns all donors and amounts |
| `get_donor_amount(donor)` | Returns individual donation amount |

### Error Types (5)
1. **Wallet not found** → Wallet install prompt
2. **User rejected** → Non-blocking info toast
3. **Insufficient balance** → Inline form error
4. **Goal not yet reached** → Withdraw blocked with warning
5. **Unauthorized** → Non-admin withdraw blocked

## Setup

### Prerequisites
- Node.js 18+
- Rust 1.84+ with `wasm32v1-none` target
- `stellar-cli` v27+

### Frontend
```bash
npm install
npm run dev
```

### Contract
```bash
cargo test                    # Run unit tests
stellar contract build --package crowdfund --out-dir contracts/crowdfund  # Build WASM
stellar contract deploy --wasm contracts/crowdfund/crowdfund.wasm --network testnet --source deployer
```

## Tech Stack
- **Frontend**: React 19, Vite 8, Tailwind CSS v4
- **Smart Contract**: Soroban SDK v27, Rust → WASM
- **Wallet**: @creit.tech/stellar-wallets-kit v2.5
- **Network**: Stellar Testnet (soroban-testnet.stellar.org)
- **SDK**: @stellar/stellar-sdk v16

## Screenshot

![Stellar Remit - Crowdfund](screenshot.png)

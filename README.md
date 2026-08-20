# Stellar Remit

A non-custodial cross-border payment and crowdfunding dApp on Stellar Testnet. Built as a continuously evolving project across the [Stellar Journey to Mastery](https://builders.stellar.org/journey-to-mastery/) belt levels.

## Problem

Traditional cross-border remittances involve high fees, multi-day settlement, and opaque intermediary chains. Stellar settles in 3-5 seconds for sub-cent fees, but most tooling is either too technical or too narrow. Stellar Remit starts from "send money to someone else, simply" and evolves into a Soroban-powered crowdfunding tool with smart contract escrow.

## Features

### White Belt (Level 1)
- **Wallet Connect / Disconnect** — Freighter browser extension, testnet only
- **XLM Balance Display** — real-time balance fetched from Horizon testnet
- **Friendbot Faucet** — one-click testnet XLM funding for new/empty accounts
- **Send XLM Payments** — build, sign (via Freighter), and submit native payment transactions
- **Transaction Feedback** — success/failure modal with transaction hash and StellarExpert explorer link
- **Recent Payments** — last 10 payment operations for the connected account

### Yellow Belt (Level 2)
- **Smart Contract Escrow** — Soroban contract manages donations, tracks per-donor amounts, and handles admin withdrawals
- **Multi-Wallet Support** — Freighter, LOBSTR, Rabet, Albedo, Hana via StellarWalletsKit
- **Real-Time Event Polling** — 5s interval with ledger cursor tracking for live donation updates
- **Transaction Status** — pending → success/error with Stellar Expert explorer links
- **Admin Withdrawal** — campaign admin can withdraw funds only after goal is reached
- **Animated Canvas Background** — dynamic dot-grid arch with wave distortion

## Smart Contract

**Contract Address**: `CDI3URZZQOOKNUEEJXACSOU6KVE6IFQ6CGPBSYMPBILPTQFSR6FFURCU`

**Deploy Transaction**: [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/db19d9a113c5188771f3eac2274d4f00bcb0f05e2f200dc416039bc156503ecf)

| Function | Description |
|----------|-------------|
| `initialize(admin, goal)` | Set admin and funding goal (one-time) |
| `donate(donor, amount)` | Donate XLM to the campaign |
| `withdraw(admin)` | Admin withdrawal (only after goal reached) |
| `get_progress()` | Returns `(total_raised, goal)` |
| `get_donors()` | Returns all donors and amounts |
| `get_donor_amount(donor)` | Returns individual donation amount |

### Error Handling (5 types)
1. **Wallet not found** → Wallet install prompt
2. **User rejected** → Non-blocking info toast
3. **Insufficient balance** → Inline form error
4. **Goal not yet reached** → Withdraw blocked with warning
5. **Unauthorized** → Non-admin withdraw blocked

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, Tailwind CSS v4 |
| Icons | Lucide React |
| Wallet SDK | `@creit.tech/stellar-wallets-kit` v2.5 |
| Stellar SDK | `@stellar/stellar-sdk` v16 |
| Smart Contract | Soroban SDK v27, Rust → WASM |
| Network | Stellar Testnet (`soroban-testnet.stellar.org`) |

## Architecture

```
[Browser] ──> [StellarWalletsKit] ──> Signs XDR (private keys never leave wallet)
   │
   ├──> [Soroban RPC] ──> Simulate / prepare / submit contract transactions
   │
   └──> [Stellar Horizon API] ──> Reads balances / recent payments
```

## Screenshots

### Wallet Connected
![Wallet Connected](docs/screenshots/Wallet%20Connected.png)

### Balance Displayed
![Balance Displayed](docs/screenshots/Balance%20Displayed.png)

### Successful Testnet Transaction
![Transaction Success](docs/screenshots/Successful%20Testnet%20Transaction.png)

### Transaction Result Shown to User
![Transaction Result](docs/screenshots/Transaction%20Result%20Shown%20to%20User.png)

## Setup

### Prerequisites

- Node.js v18+
- Rust 1.84+ with `wasm32v1-none` target
- `stellar-cli` v27+
- A Stellar wallet extension (Freighter recommended)

### Frontend

```bash
git clone https://github.com/MayankShastri/stellar-remit.git
cd stellar-remit
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### Smart Contract

```bash
cargo test                                    # Run unit tests
stellar contract build --package crowdfund    # Build WASM
stellar contract deploy \
  --wasm contracts/crowdfund/crowdfund.wasm \
  --network testnet \
  --source deployer                           # Deploy to testnet
```

### Build for Production

```bash
npm run build
```

Output goes to `dist/`. Deploy to any static host (GitHub Pages, Vercel, Netlify).

## What's Next

Built as part of the Stellar Journey to Mastery builder program. Current belt: **Level 2 (Yellow Belt)**.

- **Level 3 (Orange Belt):** Full mini dApp with tests, production hardening, Anchor-facing idea pitch for remittance/group settlement
- **Level 4+:** Production MVP, user onboarding, mainnet launch

## License

MIT

# Stellar Remit - Crowdfund

A Soroban-powered crowdfunding dApp built for the Stellar Journey to Mastery (Yellow Belt / Level 2).

## Features

- **Smart Contract Escrow**: Donations transfer real XLM into the contract, track per-donor amounts, and pay out to the admin on withdrawal
- **Multi-Wallet Support**: Connect with Freighter, LOBSTR, Rabet, Albedo, Hana via StellarWalletsKit
- **Real-Time Updates**: Event polling every 5s with ledger cursor tracking
- **Transaction Status**: Pending → Success/Error with Stellar Expert explorer links
- **Admin Withdrawal**: Campaign admin can withdraw funds only after goal is reached

## Smart Contract

**Contract Address**: `CCB7Z2LLI7XGAE2MMTNHBFA3CG7OD5LRI2LEM5WX5ZBD3ESDJTEJZ2CT`

**Deploy Transaction**: [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/bc04466395a0afc789a17206253ec3c06528bf59a6a10b2a705004683443b36a)

The contract acts as a real escrow: `donate` pulls XLM from the donor into the contract, and `withdraw` transfers the full escrow balance to the admin once the goal is reached.

### Verified Contract Calls
| Call | Tx Hash | Explorer |
|------|---------|----------|
| `initialize` (admin + goal) | `844754f3364cf0c481d38f493fff875a8e74e4def73bb3bf1e73f70c23e914bd` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/844754f3364cf0c481d38f493fff875a8e74e4def73bb3bf1e73f70c23e914bd) |
| `donate` (12 XLM, crosses goal) | `c8325d1bea2ec86efa06074eae9f692794cc742d20bb3848fcaf4872a6ff9515` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/c8325d1bea2ec86efa06074eae9f692794cc742d20bb3848fcaf4872a6ff9515) |

### Contract Functions
| Function | Description |
|----------|-------------|
| `initialize(admin, token, goal)` | Set admin, token (native XLM), and funding goal (one-time) |
| `donate(donor, amount)` | Transfer XLM into escrow and record the donation |
| `withdraw(admin)` | Admin-only payout of escrow to admin after goal reached |
| `get_progress()` | Returns (total_raised, goal) |
| `get_donors()` | Returns all donors and amounts |
| `get_donor_amount(donor)` | Returns individual donation amount |

### Error Types (5)
1. **Wallet not found** → Wallet install prompt in the connect modal
2. **User rejected** → Non-blocking info toast
3. **Insufficient balance** → Inline form error with live wallet balance shown
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

![Stellar Remit - Crowdfund](docs/screenshots/Stellar%20Remit-Crowdfund.png)

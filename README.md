# TSender UI

TSender is a web UI for gas-optimized bulk ERC20 token transfers. This project is the frontend (Next.js + TypeScript) that lets users connect a Web3 wallet, upload recipient lists and token amounts, and execute a single gas-efficient airdrop transaction using the T-Sender smart contract.

Demo: https://t-sender-ui-alpha.vercel.app/

---

Table of Contents
- [Features](#features)
- [How it works](#how-it-works)
- [Tech stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Running tests and E2E](#running-tests-and-e2e)
- [Usage](#usage)
- [CSV / input format](#csv--input-format)
- [Configuration & supported chains](#configuration--supported-chains)
- [Security & disclaimers](#security--disclaimers)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

---

Features
- Connect any RainbowKit-compatible Web3 wallet (MetaMask, WalletConnect, etc.).
- Upload recipients and token amounts (comma or newline separated).
- View token metadata and calculated totals before submitting.
- Safe Mode vs Unsafe Mode UI (visual indicators for caution).
- Uses wagmi + RainbowKit for wallet infrastructure and contract interactions.
- Tests configured with Vitest and Playwright for E2E.

How it works
- The UI uses wagmi and RainbowKit to connect wallets and sign transactions.
- It reads token metadata (name, symbol, decimals) from the ERC20 contract and computes the total amounts in wei.
- It interacts with the T-Sender contract (ABI included in `src/constants.ts`, function `airdropERC20`) to submit a single batch airdrop transaction.
- Chain-specific contract addresses are defined in `src/constants.ts` (`chainsToTSender`).

Tech stack
- Next.js (app router) + TypeScript
- React + Tailwind CSS
- wagmi + RainbowKit for wallet/connectivity
- framer-motion for UI animations
- Vitest for unit tests
- Playwright for E2E tests

Prerequisites
- Node.js 18+ (or current LTS)
- pnpm, npm, or yarn
- A Web3 wallet (MetaMask, WalletConnect-capable wallet) for testing flows that send transactions
- A WalletConnect Project ID (see Environment variables)

Getting started (local)
1. Clone the repo
   git clone https://github.com/rocknwa/TSender-UI.git
   cd TSender-UI

2. Install dependencies
   - npm:
     npm install
   - pnpm:
     pnpm install
   - yarn:
     yarn install

3. Create environment file
   Create a `.env.local` 

4. Run dev server
   - npm:
     npm run dev
   - pnpm:
     pnpm dev
   - yarn:
     yarn dev

   The app will be available at http://localhost:3000 by default.

Environment variables
- NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID — WalletConnect Cloud (or self-hosted) project ID used by RainbowKit/WalletConnect. The code expects this variable in `src/rainbowKitConfig.tsx`.

Example `.env.local`:
```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
```

If you add other environment variables (for analytics, Sentry, or deployment), include them here.

Build & production
- pnpm:
  pnpm build
  pnpm start

Running tests
- Unit / component tests (Vitest)
  npx vitest
  or
  pnpm test

- End-to-end tests (Playwright)
  npx playwright test
  or
  pnpm playwright test

Note: Playwright config uses baseURL `http://localhost:3000`. Start the dev server or build & start before running E2E tests.

Usage
1. Open the app and connect your wallet using the Connect button.
2. Enter or upload the recipients and amounts.
3. The UI fetches token metadata (name, decimals) and shows transaction details (total tokens, amounts in wei).
4. Choose Safe Mode or Unsafe Mode (UI changes color to indicate risk).
5. Approve the ERC20 allowance if required (the UI triggers an approval flow).
6. Submit the airdrop transaction — monitor the transaction hash and receipts via your wallet or in the UI.

CSV / input format
- Supported formats in the UI: comma-separated values or newline-separated entries.
- Typical two-column CSV:
  address, amount
  0xAb.., 1.5
  0xCd.., 2.0

- The UI expects the number of amounts to match the number of addresses.

Configuration & supported chains
- Contract addresses and chain mappings are defined in `src/constants.ts` — `chainsToTSender`.
- The RainbowKit config includes several chains (mainnet, optimism, arbitrum, base, zksync, sepolia, anvil) but supported runtime chains depend on entries inside `chainsToTSender`.

Security & disclaimers
- This UI instructs user wallets to sign transactions that transfer tokens. Always double-check recipient addresses and amounts before sending.
- This repo is an interface and is not financial advice.
- Review the smart contract (T-Sender) separately before using with valuable tokens.
- Use Safe Mode if you are unsure; Unsafe Mode is intended for advanced testing and may skip safety checks.

Contributing
- Contributions are welcome. Please open issues for bugs and feature requests.
- Suggested workflow:
  1. Fork the repo
  2. Create a feature branch
  3. Add tests where applicable (Vitest for units, Playwright for E2E)
  4. Open a pull request with a clear description of changes

Suggested PR checklist:
- Implements feature or bug fix
- Adds/updates tests
- Updates README or docs if user-facing behavior changed
- Linted and type-checked

Acknowledgements
- Built with Next.js, wagmi, RainbowKit, framer-motion, TailwindCSS, Vitest, and Playwright.

Contact / support
- For issues or feature requests, please open an issue in this repository: https://github.com/rocknwa/TSender-UI/issues

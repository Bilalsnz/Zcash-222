# Payout Gate

**Payment policy checks, a deterministic agent brief, and verifiable audit receipts for Zcash operations.**

Payout Gate is a lightweight, browser-first prototype with two views:

1. **Payment Console** — prepare a batch, configure policy limits, and run deterministic checks.
2. **Agent & Audit** — review Gatekeeper's evidence-based explanation, inspect a Zcash transaction, create and verify SHA-256-linked receipts, export receipt JSON, and optionally broadcast an already-signed raw transaction after explicit confirmation.

## Live Zcash data

The app uses the public ZecBlock v1 API documented at https://zecblock.com/docs:

- `GET /v1/network/blockchain-info` for network status.
- `GET /v1/blocks?limit=1` for recent block data.
- `GET /v1/transactions/:txid` for transaction lookup.
- `POST /v1/transactions/broadcast` to submit an already-signed raw transaction, with no private key accepted by the app.

The UI displays provider responses and failures honestly. API coverage, response shape, availability, rate limits, and browser CORS policy depend on the provider. The app must not be treated as a Zcash full node or wallet.

## Important boundaries

- **No wallet or key custody.** Never enter a seed phrase or private key.
- **Policy approval is not a blockchain transaction.** The payment builder only evaluates rules; it does not construct a shielded transaction.
- **Broadcast is a real-network action.** It is disabled until the user checks the acknowledgement and confirms a second browser prompt. Only an already-signed raw transaction is accepted.
- **No claim of shielded transaction construction.** Shielded transaction construction and wallet trial-decryption are not implemented in this prototype.
- **Gatekeeper is deterministic.** It summarizes actual rule results; it does not invent chain data or autonomously authorize payments.
- **Hash-chain receipts are tamper-evident, not signed.** They detect edits to the recorded fields and ordering, but do not prove signer identity or authorization.
- **Receipt storage is session-only until exported.** Export JSON to keep a copy. Do not treat a browser session as durable storage.
- **Public chain data has privacy limits.** A public transaction lookup does not reveal all shielded details.

## Run and deploy

This is a static app with no build step and no third-party JavaScript dependencies.

- Open `index.html` in a local static server or deploy the repository as a static site.
- For GitHub Pages: open **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/(root)`, then save.
- HTTPS is recommended. Web Crypto is required for receipt hashing.
- No paid API key is configured in the frontend. If the provider's API is unavailable or blocks browser requests, the interface shows an error rather than fabricating a response.

## Current scope

Included: amount parsing with integer zatoshi, per-payment limit, batch cap, optional payee allowlist, duplicate-ID checks, second-approval threshold state, agent brief, live network/block lookup, transaction lookup, hash-chain receipts, JSON export, and guarded signed-transaction broadcast.

Not included: wallet connection, shielded transaction construction, signing, automatic second-person authorization, identity proof, persistent database, or a cryptographic signature on audit receipts.

## License

No license has been added yet.
# StacksFit — Architecture & Implementation Plan

StacksFit is an AI-powered fitness app that records progress and achievements on the Stacks blockchain. This document outlines the system architecture, data flow, smart-contract designs, API surface, privacy/security considerations, and an implementation roadmap.

## Goals

- Personalized, adaptive workout and nutrition plans powered by AI.
- Tamper-proof recording of verified achievements on Stacks (mint NFTs/record proofs).
- User-owned data with selective sharing and privacy-first storage.

## High-level architecture

- Frontend: Next.js (TypeScript) — UI, user onboarding, plan viewer, workout tracker, NFT gallery.
- Backend: Node.js (TypeScript) — API for user management, AI proxy, embedding worker, and contract relay.
- Database: Supabase Postgres with pgvector for embeddings.
- AI: OpenAI (or chosen LLM) for plan generation and adjustments; embedding model for personalization.
- Blockchain: Stacks (testnet/mainnet) for storing proofs and minting NFTs (Clarity contracts). Use `micro-stacks`/`stacks.js` on frontend.
- Contract testing: Clarinet for unit/integration testing of Clarity contracts.

Diagram (logical):

- User <-> Next.js frontend
- Frontend <-> Backend API (auth + data)
- Backend <-> Supabase (Postgres + vector)
- Backend <-> LLM provider (OpenAI)
- Frontend <-> Wallet (micro-stacks) -> Stacks blockchain
- Backend <-> Clarinet (dev/test), Stacks Node API (deploy)

## Data model (Prisma sketch)

```prisma
model User {
  id        String @id @default(cuid())
  address   String @unique // Stacks principal
  email     String?
  createdAt DateTime @default(now())
  profile   Json?
}

model Workout {
  id        String @id @default(cuid())
  userId    String
  startedAt DateTime
  duration  Int // seconds
  calories  Int?
  metrics   Json? // heart rate, steps
  verified  Boolean @default(false)
}

model Achievement {
  id        String @id @default(cuid())
  userId    String
  type      String
  value     Json
  minted    Boolean @default(false)
  txId      String?
}

model Embedding {
  id        String @id @default(cuid())
  content   String
  vector    Json
  meta      Json?
  createdAt DateTime @default(now())
}
```

Note: Use Supabase for RLS policies and storage. For pgvector, store vectors in a dedicated table using `vector` column type; Prisma may access vectors via raw SQL or `supabase-js`.

## Smart contract design (Clarity)

Contracts:

1. Achievements contract
  - Functions: record-proof, mint-badge
  - Store mapping from user principal -> list of achievement hashes / badge IDs
  - Minting controlled via contract owner or via verified on-chain proofs

2. Badge NFT contract
  - Standard NFT contract that mints badge tokens when proof is accepted

Design notes:

- Off-chain verification: heavy computation or raw sensor data stays off-chain. The backend computes a proof (hash) and the user signs a claim; the signed claim is submitted as a tx to the contract which verifies the signer and stores the proof or mints NFT.
- Use post-conditions to require correct fee payments when minting.

## APIs

- POST /api/auth/verify — verify signed message from user wallet and create session
- GET /api/user — retrieve user data, progress, and achievements
- POST /api/workouts — submit a workout record (server verifies authenticity)
- POST /api/workouts/:id/verify — backend-run verification flow that creates a proof and prepares a tx
- POST /api/achievements/:id/mint — initiate minting (signed by user wallet) or backend-signed mint (owner)
- POST /api/ai/plan — create/update user plan (server calls LLM)

## Verification flow (recording progress)

1. User completes workout on device / app.
2. App posts workout data to backend (TLS). Backend performs checks (timestamps, device signatures if available, rate-limits).
3. Backend generates a canonical proof object (hash of workout + metadata) and stores it in DB.
4. User signs a claim (or the backend prepares a signed transaction) to submit to Stacks contract via wallet.
5. Contract records the proof and optionally triggers NFT minting.

## AI personalization

- Use OpenAI to generate plans and adjust difficulty. Store user embeddings in Supabase pgvector.
- Worker pipeline:
  - On new workout data: create/update user embedding.
  - Run personalization process weekly/daily to update plan recommendations.

## Privacy & security

- Use Supabase RLS to ensure only owners can access their workout data.
- Use `SUPABASE_SERVICE_ROLE_KEY` only server-side.
- Hash or aggregate sensitive data before storing or storing pointers off-chain.
- Provide export and deletion flows for users.

## UI & UX

- Dark-first theme per provided colors and spacing.
- Main screens: Dashboard, Workout Recorder, Plan, Achievements, NFT Gallery, Settings

## Deployment

- Frontend: Vercel
- Backend: Render / Railway / Fly
- DB: Supabase (managed Postgres + pgvector)
- CI: GitHub Actions run tests and deploy

## Roadmap & milestones

1. MVP: Authentication, basic AI plan generation, workout submission, off-chain proof storage, local Clarinet-tested contract for proof records.
2. MVP+: Wallet flows, minting NFTs for achievements, personalization via embeddings.
3. Production: Audit contracts, scalability, sponsor flows, marketplace for rewards.

---

If you'd like, I can scaffold `apps/stacksfit` based on the BitEdu scaffold, implement the `/api/auth/verify` flow using `stacks.js`, create Clarity contract templates under `contracts/`, and add example UI components matching the visual style.

# BitEdu — Build Guide

This document describes how to build BitEdu: an AI-powered learning platform for blockchain and Bitcoin topics with hands-on Stacks/Clarity coding exercises.

## Project overview

- Goals: Personalized learning paths using LLMs, interactive Clarity contract exercises, wallet-based auth with Stacks, and a scalable web app.
- Audience: Developers and learners who want to learn Stacks and Clarity with practical examples.

## High-level architecture

- Frontend: Next.js (TypeScript) — UI, lesson player, interactive coding sandbox, wallet integration.
- Backend: Node.js (TypeScript) with Express or NestJS — APIs for user profiles, course state, LLM proxies, job workers.
- Database: PostgreSQL (Prisma ORM) — users, progress, lesson metadata.
- Vector DB: Weaviate/RedisVector/Pinecone (optional) — embeddings for search and personalization.
- AI: LLM provider (OpenAI, Anthropic, or self-hosted), embeddings for content search and personalization.
- Stacks integration: micro-stacks or @stacks/connect / stacks.js for wallet auth, contract calls, and signing.
- Contract tooling: Clarinet for local Clarity testing, integration testing, and simulation.
- DevOps: Docker, GitHub Actions, deploy to Vercel (frontend) and Railway/Render/VPS for backend & DB.

## Technology choices (recommended)

- Frontend: Next.js 14+, TypeScript, React 18, TailwindCSS, SWR or React Query
- Backend: Node.js 20+, TypeScript, NestJS (recommended) or Express + tRPC for typed APIs
- ORM: Prisma (Postgres)
- Auth: Stacks wallet (micro-stacks / @stacks/connect) for crypto auth + JWT session in backend
- AI: OpenAI or Azure OpenAI for LLMs; OpenAI or Hugging Face embeddings; LangChain (optional) for orchestration
- Vector DB: Redis Vector, Weaviate, or Pinecone
- Testing: Jest + Playwright (e2e)
- Infrastructure: Dockerfiles for services; GitHub Actions for CI; Terraform for infra (optional)

## Developer environment setup

Prereqs (macOS): Node.js (use nvm), Docker, PostgreSQL (local or Docker), pnpm/npm

1. Clone repo

2. Copy `.env.example` to `.env` and set variables:

- DATABASE_URL=postgresql://user:pass@localhost:5432/bitedu
- NEXT_PUBLIC_API_URL=http://localhost:3000/api
- OPENAI_API_KEY=sk_...
- VECTOR_DB_URL=...
- STACKS_NETWORK=testnet
- STACKS_API_URL=https://stacks-node-api.testnet.stacks.co

3. Install dependencies (pnpm recommended):

pnpm install

4. Run database migrations (Prisma):

pnpm prisma migrate dev

5. Start development (frontend + backend):

pnpm dev:all

## Stacks & Clarity integration

- Use `micro-stacks` or `@stacks/connect` on the frontend to authenticate users via their Stacks wallets.
- Expose minimal wallet-based auth flow to backend: on sign-in, verify signed message server-side and issue short-lived JWT.
- Provide example Clarity contracts in `contracts/` and a `scripts/` folder with Clarinet commands to run local tests and deploy to testnet.

Example clarinet workflow:

1. Install Clarinet (see docs in repo or hiro docs)
2. Run local tests: `clarinet test`
3. Simulate mainnet execution with Clarinet for large scenarios (see `mainnet-execution-simulation` docs linked)

## AI personalization

- Store user embeddings (session-level and long-term) in vector DB.
- Use prompt templates and a content-index to generate personalized lesson sequences.
- Provide guardrails: content length limits, safety filters, and cost controls (cache common responses).

Components:

- LLM service microservice (server-side) that proxies requests, logs cost, and handles retries.
- Embeddings worker to encode lessons and user interactions and upsert to vector DB.

## Interactive Clarity sandbox

- Implement a browser-based playground that lets users edit Clarity source and run tests via a sandboxed backend that uses Clarinet in a container.
- Use Docker to run Clarinet and return test output; limit CPU/time for safety.

## API contract (minimal)

- POST /api/auth/verify - verify wallet signature, create session
- GET /api/user - returns current user a nd progress
- POST /api/lessons/:id/complete - mark lesson complete
- POST /api/ai/generate - server-side LLM proxy
- POST /api/clarinet/run - submit Clarity code to be tested in container

## CI / Quality gates

- GitHub Actions pipeline:
  - lint (ESLint + Prettier)
  - typecheck (tsc)
  - unit tests (Jest)
  - e2e (Playwright, run in testnet env or mocked)
  - build and push Docker images

## Deployment

- Frontend: Vercel or Netlify (Next.js optimized). Use environment variables in platform dashboard.
- Backend: Railway/Render/DigitalOcean App Platform with a managed Postgres instance.
- Vector DB: Managed Pinecone or Redis Cloud.

## Roadmap & milestones

1. MVP: Auth, lesson pages, simple AI recommendations, Clarinet integration for exercises.
2. Expand content: full Clarity curriculum, interactive sandbox, more lessons.
3. Personalization: user embeddings, long-term learner models.
4. Monetization: premium content, cohort-based courses.

## References

- Clarinet and Hiro docs (you provided):
  - https://docs.hiro.so/tools/clarinet/browser-sdk-reference
  - https://docs.hiro.so/tools/clarinet/chainhook-integration
  - https://docs.hiro.so/tools/clarinet/clarity-formatter
  - https://docs.hiro.so/tools/clarinet/cli-reference
  - https://docs.hiro.so/tools/clarinet/contract-interaction
  - https://docs.hiro.so/tools/clarinet/deployment
  - https://docs.hiro.so/tools/clarinet/faq
  - https://docs.hiro.so/tools/clarinet/integration-testing
  - https://docs.hiro.so/tools/clarinet/local-blockchain-development
  - https://docs.hiro.so/tools/clarinet/mainnet-execution-simulation
  - https://docs.hiro.so/tools/clarinet/project-development
  - https://docs.hiro.so/tools/clarinet/project-structure
  - https://docs.hiro.so/tools/clarinet/pyth-oracle-integration
  - https://docs.hiro.so/tools/clarinet/quickstart
  - https://docs.hiro.so/tools/clarinet/sbtc-integration
  - https://docs.hiro.so/tools/clarinet/sdk-introduction
  - https://docs.hiro.so/tools/clarinet/sdk-reference
  - https://docs.hiro.so/tools/clarinet/stacks-js-integration
  - https://docs.hiro.so/tools/clarinet/unit-testing
  - https://docs.hiro.so/tools/clarinet/validation-and-analysis
  - https://docs.hiro.so/tools/clarinet/vscode-extension
  - https://docs.stacks.co/guides-and-tutorials/hello-stacks-quickstart-tutorial
  - https://learn.stacks.org/course/clarity-camp
  - https://stacks.js.org
  - https://micro-stacks.dev/docs/getting-started

## Next steps I can take for you

- Scaffold the repository with the recommended tech stack and initial files.
- Implement auth flow and a sample lesson page.
- Create Clarinet contract examples and sandbox runner.

---

End of build.md

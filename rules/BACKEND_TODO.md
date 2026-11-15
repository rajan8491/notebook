# Backend TODO (Python, uv, FastAPI, PostgreSQL, SQLAlchemy, pgvector)

Legend: `[ ]` todo · priority **P0** (MVP) / **P1** (soon) / **P2** (later)

## Phase 0: Project Setup
- [ ] **P0** `uv init`, set Python 3.12, add deps: `fastapi uvicorn[standard] sqlalchemy[asyncio] asyncpg alembic pydantic-settings pgvector`
- [ ] **P0** Dev deps: `pytest pytest-asyncio httpx ruff mypy testcontainers`
- [ ] **P0** Folder structure per ARCHITECTURE.md
- [ ] **P0** `core/config.py` with pydantic-settings (`.env`, `.env.example`)
- [ ] **P0** Docker Compose: postgres (pgvector image), redis, minio
- [ ] **P0** Ruff + mypy config, pre-commit hooks
- [ ] **P0** Structured logging (structlog) + request-ID middleware
- [ ] **P0** Health endpoint `/healthz`, CORS, global exception handlers
- [ ] **P1** GitHub Actions CI (lint, types, tests)
- [ ] **P1** Makefile/justfile: `dev`, `test`, `migrate`, `worker`

## Phase 1: Database & Auth
- [ ] **P0** Async SQLAlchemy engine/session dependency
- [ ] **P0** Alembic setup; first migration enables `CREATE EXTENSION vector`
- [ ] **P0** Models: `users`, `notebooks`, `notes`, `note_chunks`, `conversations`, `messages`, `ingestion_jobs`
- [ ] **P0** Indexes: HNSW on embedding, GIN on tsvector, btree on `(user_id, note_id)`
- [ ] **P0** Register/login, argon2 hashing, JWT access + refresh, `get_current_user` dep
- [ ] **P1** Row-Level Security policies on notes/chunks by `user_id`
- [ ] **P1** Password reset / email verification
- [ ] **P2** Google OAuth

## Phase 2: Notes CRUD
- [ ] **P0** Notebooks CRUD
- [ ] **P0** Notes CRUD (create/edit from editor: store `content_json` + `content_md` + `content_hash`)
- [ ] **P0** Pagination, filtering, search-by-title
- [ ] **P0** Ownership checks on every endpoint (tests for cross-user access!)
- [ ] **P0** Delete note cascades chunks + S3 objects
- [ ] **P1** Soft delete / trash
- [ ] **P1** Tags

## Phase 3: Source Ingestion
- [ ] **P0** Storage abstraction (S3/MinIO via `aioboto3`), presigned URLs
- [ ] **P0** `POST /notes/upload` (type + size validation, MIME sniffing)
- [ ] **P0** Parsers (common interface `parse(source) -> ParsedDoc`):
  - [ ] PDF (`pymupdf4llm`)
  - [ ] DOCX (`python-docx`)
  - [ ] Markdown / plain text
  - [ ] URL (`trafilatura`, SSRF protection: block private IPs)
- [ ] **P1** YouTube transcript parser
- [ ] **P1** OCR fallback for scanned PDFs
- [ ] **P2** PPTX, images (vision LLM), audio (Whisper)
- [ ] **P0** Job queue + worker (ARQ/Dramatiq/Procrastinate), retries with backoff
- [ ] **P0** Status lifecycle: `pending → processing → ready/failed` with error message
- [ ] **P1** Idempotency: skip if `content_hash` unchanged

## Phase 4: Chunking & Embedding
- [ ] **P0** Markdown-aware chunker (headings → paragraphs → sentences), 400–600 tokens, 10–15% overlap
- [ ] **P0** Preserve metadata: `heading_path`, `page`, `chunk_index`
- [ ] **P0** Don't split code blocks/tables
- [ ] **P0** Embedding provider interface + OpenAI/Voyage implementation
- [ ] **P0** Batch embedding with rate-limit handling and retries
- [ ] **P0** Replace-chunks-on-edit in a single transaction
- [ ] **P1** Store `embedding_model`; script to re-embed when model changes
- [ ] **P1** Unit tests for chunker with edge cases (empty doc, huge paragraph, tables, unicode)

## Phase 5: Retrieval
- [ ] **P0** Vector search (cosine, filtered by `user_id` + scope)
- [ ] **P0** Full-text search (`tsvector` + `websearch_to_tsquery`)
- [ ] **P0** Hybrid merge with Reciprocal Rank Fusion
- [ ] **P0** `POST /search` debug endpoint returning chunks with scores
- [ ] **P1** Reranker (Cohere / bge-reranker), top 30 → 8
- [ ] **P1** Tune HNSW (`m`, `ef_construction`, `hnsw.ef_search`)
- [ ] **P2** MMR / diversity, parent-document expansion (include neighbor chunks)

## Phase 6: Chat
- [ ] **P0** LLM provider interface + Anthropic implementation (streaming)
- [ ] **P0** Conversations + messages endpoints
- [ ] **P0** Query rewriting using recent history
- [ ] **P0** Prompt builder: grounded-only rules, numbered context, citation format
- [ ] **P0** SSE streaming endpoint; final event with structured citations
- [ ] **P0** Persist messages, citations, token usage
- [ ] **P0** "Not found in your notes" behavior when retrieval is weak (score threshold)
- [ ] **P1** History trimming/summarization to fit context window
- [ ] **P1** Scope selection (single note / notebook / all)
- [ ] **P1** Handle client disconnect/cancel cleanly
- [ ] **P2** Study tools: summary, flashcards, quiz from selected notes
- [ ] **P2** Tool-use / agentic multi-step retrieval for complex questions

## Phase 7: Quality, Evals, Observability
- [ ] **P0** Golden set: ~30–50 Q/A pairs over sample notes
- [ ] **P0** Eval script: retrieval recall@k + answer faithfulness (LLM-as-judge or `ragas`)
- [ ] **P1** Langfuse/OpenTelemetry tracing for each RAG step (latency, tokens, cost)
- [ ] **P1** Sentry error tracking
- [ ] **P1** Per-user usage/cost tracking and quotas
- [ ] **P1** Rate limiting (`slowapi` or Redis-based) on upload & chat

## Phase 8: Testing
- [ ] **P0** pytest + testcontainers (real Postgres with pgvector)
- [ ] **P0** Tests: auth, ownership isolation, CRUD, chunker, retrieval, SSE chat (mock LLM)
- [ ] **P1** Fake embedding/LLM providers for deterministic tests
- [ ] **P1** Load test chat + search endpoints (locust/k6)

## Phase 9: Security & Ops
- [ ] **P0** Secrets only via env; never log note text or keys
- [ ] **P0** Upload hardening (size caps, type whitelist, filename sanitizing)
- [ ] **P0** SSRF guard for URL ingestion
- [ ] **P1** Prompt-injection mitigations (delimit context, ignore instructions inside notes)
- [ ] **P1** Data export + account deletion
- [ ] **P1** Dockerfile (multi-stage with uv), separate API/worker commands
- [ ] **P1** Backups for Postgres + S3; migration runbook
- [ ] **P2** Audit logs

## Definition of Done (per task)
- Typed, linted, tested, migration included if schema changed, OpenAPI schema updated, no secrets in logs.

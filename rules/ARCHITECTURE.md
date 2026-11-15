# Architecture: AI Notes Management with RAG Chat

## 1. Product Summary
Students add notes from many sources (PDF, DOCX, URLs, pasted text, YouTube transcripts) or write their own in a rich-text editor, then chat with their notes. Answers are grounded in the notes with citations.

## 2. Tech Stack

### Frontend
| Concern | Choice |
|---|---|
| Build | Vite + React 18 + TypeScript (strict) |
| Routing | React Router v6 |
| Server state | TanStack Query (React Query) |
| UI state | useState and Context API |
| Styling | Tailwind CSS + shadcn/ui |
| Editor | TipTap (ProseMirror), stores JSON + derived markdown |
| Forms | react-hook-form + zod |
| API client | Generated from FastAPI OpenAPI (`orval` or `openapi-typescript`) |
| Chat streaming | `@microsoft/fetch-event-source` (SSE with auth headers) |
| Markdown render | `react-markdown` + `remark-gfm` + `rehype-highlight` |
| Testing | Vitest, Testing Library, MSW, Playwright |

### Backend
| Concern | Choice |
|---|---|
| Package manager | `uv` |
| API | FastAPI (async) + Pydantic v2 |
| DB | PostgreSQL 16 + `pgvector` |
| ORM / migrations | SQLAlchemy 2.0 (async) + Alembic |
| Background jobs | ARQ (Redis) or Dramatiq; simple option: Procrastinate (Postgres-only) |
| File storage | S3-compatible (MinIO locally, S3/R2 in prod) |
| Auth | JWT access + refresh (or `fastapi-users`); OAuth Google later |
| Parsing | `pymupdf4llm` (PDF to markdown), `python-docx`, `trafilatura` (web), `youtube-transcript-api` |
| OCR (scanned PDFs) | `ocrmypdf` / Tesseract, optional |
| Chunking | Custom markdown-aware recursive splitter (use `tiktoken` for token counts) |
| Embeddings | OpenAI `text-embedding-3-small` (1536d) or Voyage `voyage-3`; local fallback `bge-m3` |
| Retrieval | Hybrid: pgvector (HNSW, cosine) + Postgres FTS (`tsvector`/GIN), merged with Reciprocal Rank Fusion |
| Reranking | Optional: Cohere Rerank or `bge-reranker` on top 30 to 8 |
| LLM | Claude (Anthropic SDK), streaming, behind a provider interface |
| Observability | structlog, OpenTelemetry, Langfuse (LLM traces) |
| Evals | Golden Q/A set + `ragas` or custom LLM-as-judge |
| Tests | pytest, pytest-asyncio, testcontainers (Postgres+pgvector), httpx |
| Lint/types | ruff, mypy/pyright |

**Why not LangChain?** The pipeline is simple (parse, chunk, embed, retrieve, generate). Plain Python with small service classes is easier to debug, test and change. Use LlamaIndex/LangChain only for isolated utilities if needed.

## 3. High-Level System

```
┌──────────────┐   REST + SSE    ┌───────────────────────────┐
│ React SPA    │◀──────────────▶│ FastAPI (API layer)       │
│ (TanStack Q) │                 │  auth, notes, sources,    │
└──────────────┘                 │  chat, search             │
                                 └──────┬──────────┬─────────┘
                                        │          │ enqueue
                                        ▼          ▼
                              ┌──────────────┐  ┌──────────────┐
                              │ PostgreSQL   │  │ Redis (queue)│
                              │ + pgvector   │  └──────┬───────┘
                              └──────▲───────┘         ▼
                                     │          ┌──────────────────┐
                                     └──────────│ Worker           │
                                                │ parse → chunk →  │
                                                │ embed → store    │
                                                └───────┬──────────┘
                                                        ▼
                                               S3 / MinIO (raw files)
                                    External: Embedding API, LLM API
```

## 4. Data Model (core tables)

```
users(id, email, password_hash, created_at)

notebooks(id, user_id, title, created_at)            -- optional grouping/subject

notes(id, user_id, notebook_id, title,
      source_type  ENUM(editor, pdf, docx, url, text, youtube),
      source_ref   TEXT,            -- url / file key
      content_json JSONB,           -- editor doc (TipTap)
      content_md   TEXT,            -- canonical text used for chunking
      content_hash TEXT,            -- skip re-embedding if unchanged
      status ENUM(pending, processing, ready, failed),
      error TEXT, created_at, updated_at)

note_chunks(id, note_id, user_id, chunk_index,
            content TEXT, token_count INT,
            heading_path TEXT[],     -- e.g. {"Chapter 2","Photosynthesis"}
            page INT NULL,
            embedding VECTOR(1536),
            tsv TSVECTOR GENERATED ALWAYS AS (to_tsvector('english', content)) STORED,
            embedding_model TEXT, created_at)
  INDEX hnsw (embedding vector_cosine_ops)
  INDEX gin  (tsv)
  INDEX btree (user_id, note_id)

conversations(id, user_id, title, scope JSONB, created_at)
    -- scope: {"note_ids":[...]} or {"notebook_id":...} or all notes
messages(id, conversation_id, role, content, citations JSONB, tokens_in, tokens_out, created_at)

ingestion_jobs(id, note_id, stage, attempts, error, started_at, finished_at)
```

**Multi-tenancy rule:** every query on chunks MUST filter by `user_id` (and Postgres Row-Level Security as a second layer).

## 5. Ingestion Pipeline

1. `POST /notes/upload` stores the raw file in S3, creates `note(status=pending)`, enqueues job. Returns immediately.
2. **Parse** to clean markdown (preserve headings, lists, tables, page numbers).
3. **Normalize**: strip headers/footers, fix whitespace, dedupe.
4. **Chunk**:
   - Split by markdown headings first, then paragraphs, then sentences.
   - Target 400–600 tokens, 10–15% overlap, never cut code blocks/tables mid-way.
   - Attach `heading_path` and `page` metadata.
   - Prepend a short context header to the text that is embedded (e.g. `Note: <title> > <heading path>`), but store/display the raw chunk.
5. **Embed** in batches (with retry/backoff), store vectors.
6. Mark `status=ready`. Notify the client (polling via React Query, or SSE).
7. **Editor notes**: on save (debounced) compare `content_hash`; if changed, re-chunk and replace only that note's chunks in one transaction.

## 6. Chat / RAG Flow

1. Receive question + `conversation_id` + scope.
2. **Query rewrite**: use chat history to turn follow-ups into a standalone query (small/fast LLM call).
3. **Hybrid retrieve**: top 20 vector + top 20 FTS, filtered by `user_id` + scope, merged via RRF.
4. (Optional) **Rerank** to top 6–8.
5. **Build prompt**: system rules (answer only from context, say "not in your notes" otherwise, cite as `[1]`, `[2]`) + numbered context blocks + trimmed history.
6. **Stream** tokens over SSE; final event carries `citations` (note id, chunk id, heading, page, snippet).
7. Persist message + citations + token usage.
8. UI: clicking a citation opens the note scrolled/highlighted at that chunk.

### Extras
- Modes: "strict from notes" vs "notes + general knowledge (clearly labeled)".
- Study tools later: summaries, flashcards, quizzes generated from selected notes.
- Prompt-injection hygiene: treat note content as data, never as instructions; delimit context clearly.

## 7. API Surface (v1)

```
POST   /auth/register | /auth/login | /auth/refresh
GET    /notebooks            POST /notebooks
GET    /notes?notebook_id=&q=    POST /notes (editor)
GET    /notes/{id}           PATCH /notes/{id}    DELETE /notes/{id}
POST   /notes/upload         (multipart)
POST   /notes/url            { url }
GET    /notes/{id}/status
POST   /search               { query, scope }     -- raw retrieval for debugging/UI
GET    /conversations        POST /conversations
GET    /conversations/{id}/messages
POST   /conversations/{id}/messages   -> SSE stream
```

## 8. Backend Code Layout

```
backend/
  pyproject.toml            (uv)
  alembic/
  app/
    main.py
    core/        config.py, security.py, logging.py, deps.py
    db/          base.py, session.py, models/
    schemas/     (pydantic)
    api/v1/      auth.py notes.py chat.py search.py
    services/
      notes_service.py
      ingestion/   parsers/ chunker.py embedder.py pipeline.py
      retrieval/   vector.py fts.py hybrid.py reranker.py
      chat/        rewrite.py prompt.py stream.py
      llm/         base.py anthropic.py   (provider interface)
    workers/       tasks.py
  tests/
```

Layering: `api → services → repositories/db`. No SQL in route handlers; no HTTP concerns in services.

## 9. Frontend Code Layout

```
frontend/src/
  app/          router, providers (QueryClient, Auth, Theme)
  api/          generated client, query keys, hooks (useNotes, useChat…)
  features/
    auth/  notes/  editor/  upload/  chat/  search/  settings/
  components/ui/   shadcn primitives
  lib/          sse.ts, utils.ts
  stores/       ui store (useState or conetxt API)
  types/
```

Feature-folder structure: each feature owns its components, hooks and tests.

## 10. Security & Privacy
- Hash passwords with argon2; short-lived access tokens; httpOnly refresh cookie.
- Validate upload type/size; virus scan optional; sanitize HTML from URL ingestion and editor output (DOMPurify).
- Rate-limit chat and upload endpoints; per-user token budgets.
- Never log note contents or API keys; secrets via env/secret manager.
- Provide "delete my data" (cascade: notes, chunks, S3 objects).
- Tell users their note text is sent to embedding/LLM providers.

## 11. Deployment
- Docker Compose for dev: `api`, `worker`, `postgres(pgvector)`, `redis`, `minio`.
- Prod: containerized API + worker on Fly/Render/Railway/ECS; managed Postgres with pgvector (Neon, Supabase, RDS); frontend on Vercel/Cloudflare Pages.
- CI: lint, type-check, tests, migration check, build.

## 12. Key Decisions & Trade-offs
| Decision | Why | Revisit when |
|---|---|---|
| pgvector over dedicated vector DB | One DB, transactions, joins, filters | >10M chunks or latency issues |
| Hybrid search + RRF | Notes contain exact terms/names that pure vectors miss | n/a |
| Own chunker | Control over structure + metadata | n/a |
| Background worker | Parsing/embedding is slow; keep API fast | Tiny scale: FastAPI BackgroundTasks |
| Generated TS client | Types stay in sync with backend | n/a |

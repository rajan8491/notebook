## The teck stack for backend:
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

## The file structure for backend:

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

## The Core Workflow: Plan → Build → Verify → Commit

1. **Plan first** (plan mode / "don't write code yet"):
   > Read rules/ARCHITECTURE.md and rules/BACKEND_TODO.md. Plan current Phase. List files you'll create, the models, and open questions. Don't write code yet.
2. **Review the plan**, correct it, then approve.
3. **Use git branches/worktrees** per task so you can discard bad attempts. Commit often.
4. **Implement in small slices**, one TODO section at a time, not "build the whole backend".
5. **Verify**: agent runs tests, linter, type-check. Ask it to fix failures itself.
6. **Review the diff** yourself. You are the reviewer.
7. **Commit** on a feature branch with a clear message; tick the TODO.
8. Start a fresh session (or `/clear`) between unrelated tasks to keep context clean.
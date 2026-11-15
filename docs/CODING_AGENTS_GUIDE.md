# How to Use Coding Agents on This Project

Works with Claude Code, Cursor, Copilot agent, Codex CLI, etc. Examples use Claude Code.

## 1. Repo Layout (monorepo recommended)

```
notes-ai/
  CLAUDE.md            ← agent instructions (or AGENTS.md for other tools)
  docs/
    ARCHITECTURE.md
    BACKEND_TODO.md
    FRONTEND_TODO.md
  backend/
    CLAUDE.md          ← backend-specific rules
  frontend/
    CLAUDE.md          ← frontend-specific rules
  docker-compose.yml
```

Keeping architecture and TODOs **in the repo** means the agent can read them every session.

## 2. Write a Good `CLAUDE.md` (root)

Keep it short and concrete. Example:

```md
# Project: AI Notes with RAG chat
Read docs/ARCHITECTURE.md before changing structure.
Tasks live in docs/BACKEND_TODO.md and docs/FRONTEND_TODO.md. Tick the box when done.

## Commands
- Backend: `cd backend && uv run pytest`, `uv run ruff check .`, `uv run mypy app`
- Migrations: `uv run alembic revision --autogenerate -m "msg"` then `alembic upgrade head`
- Frontend: `cd frontend && npm run dev | test | lint | typecheck | gen:api`

## Rules
- Layering: api → services → db. No SQL in route handlers.
- EVERY chunk/note query must filter by user_id.
- Async SQLAlchemy 2.0 style only. Pydantic v2.
- TypeScript strict, no `any`. Server state in React Query only.
- Never log note contents or secrets.
- After changing backend schemas, run `npm run gen:api` in frontend.
- Add tests with every feature. Don't finish with failing tests/lint/types.
```

Backend/frontend `CLAUDE.md` files hold stack-specific conventions (folder layout, naming, patterns).

## 3. The Core Workflow: Plan → Build → Verify → Commit

1. **Plan first** (plan mode / "don't write code yet"):
   > Read docs/ARCHITECTURE.md and BACKEND_TODO.md. Plan Phase 1 (DB & Auth). List files you'll create, the models, and open questions. Don't write code yet.
2. **Review the plan**, correct it, then approve.
3. **Implement in small slices**, one TODO section at a time, not "build the whole backend".
4. **Verify**: agent runs tests, linter, type-check. Ask it to fix failures itself.
5. **Review the diff** yourself. You are the reviewer.
6. **Commit** on a feature branch with a clear message; tick the TODO.
7. Start a fresh session (or `/clear`) between unrelated tasks to keep context clean.

## 4. Recommended Build Order

1. Backend Phase 0–1 (setup, DB, auth) + Frontend Phase 0–1 (shell, auth)
2. Notes CRUD (both sides) + editor
3. Ingestion: parsers, chunker, embeddings, worker
4. Retrieval + `/search` debug endpoint (**test retrieval quality before building chat**)
5. Chat streaming + citations UI
6. Evals, observability, hardening, extras

Get a thin end-to-end slice working early: *write note → chunk → ask question → get cited answer*. Then deepen each part.

## 5. Prompt Templates

**Feature:**
> Implement "Notes CRUD" from BACKEND_TODO.md Phase 2. Follow ARCHITECTURE.md layering. Include ownership checks and pytest tests (including one proving user B can't access user A's note). Run tests, ruff and mypy before finishing.

**Chunker (test-first):**
> Write tests for `services/ingestion/chunker.py` first: empty input, headings, long paragraph, code block, table, unicode. Then implement until they pass. Chunks target 500 tokens with 12% overlap.

**Bug:**
> Uploading a 40-page PDF leaves the note stuck in `processing`. Reproduce with a test, find the root cause (check worker logs and retry logic), fix it, explain the cause.

**Review:**
> Review my diff on this branch for: security (user_id filtering, SSRF, uploads), N+1 queries, missing tests, type issues. List problems by severity. Don't edit files.

**Frontend:**
> Build the chat page per FRONTEND_TODO Phase 5 using the generated API client. Stream via fetch-event-source. Handle loading/error/stop states. Add an MSW-mocked SSE test.

## 6. Tips That Make Agents Much Better

- **Give verification commands.** Agents succeed when they can run tests/lint/typecheck and see failures.
- **Small, specific tasks** beat vague big ones. Reference exact TODO items and file paths.
- **Contract-first**: finalize the OpenAPI/Pydantic schemas, generate the TS client, then build the UI against it.
- **Test-driven for tricky logic** (chunking, RRF merge, citation parsing).
- **Use git branches/worktrees** per task so you can discard bad attempts. Commit often.
- **Parallel agents**: run a backend agent and frontend agent in separate worktrees once the API contract is fixed.
- **Subagents / reviewers**: have a separate session review code with a fresh context (security, tests).
- **Keep context fresh**: new session per task; put lasting knowledge into `CLAUDE.md`, not chat.
- **Connect tools via MCP** where useful (Postgres/DB inspector, GitHub, browser/Playwright for UI checks).
- **Permissions**: allow safe commands (tests, lint, git status); keep approval on destructive ones (migrations on real DBs, `rm`, deploys).
- **Never paste real secrets or user data** into prompts; use `.env.example` and fake sample notes.

## 7. Where Agents Need Extra Supervision
- Security: auth, tenant isolation, upload handling, SSRF, prompt injection.
- Alembic autogenerate output (check pgvector index/extension statements).
- RAG quality: agents can make it *run*, but only evals tell you if it's *good*. Build the golden set early and rerun after every change to chunking/retrieval/prompts.
- Dependency choices: verify the library exists, is maintained, and versions are current.
- Over-engineering: tell it to prefer simple solutions and avoid unrequested abstractions.

## 8. Suggested First Session

1. Create repo, add the docs from this folder, and write `CLAUDE.md`.
2. Prompt: *"Scaffold backend per ARCHITECTURE.md Phase 0 only: uv project, FastAPI app with /healthz, config, Docker Compose with pgvector Postgres, ruff/mypy/pytest setup. Run everything and show me the commands to start it."*
3. Review, commit, then move to Phase 1.

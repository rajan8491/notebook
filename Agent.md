# Project: AI Notes with RAG chat
Read rules/ARCHITECTURE.md before changing structure.
Tasks live in rules/BACKEND_TODO.md and rules/FRONTEND_TODO.md. Tick the box when done.

## Commands
- Backend: `cd backend && uv run pytest`, `uv run ruff check .`, `uv run mypy app`
- Migrations: `uv run alembic revision --autogenerate -m "msg"` then `alembic upgrade head`
- Frontend: `cd frontend && npm run dev | test | lint | typecheck | gen:api`

## Rules
1. **Plan first** (plan mode / "don't write code yet"):
   > Read docs/ARCHITECTURE.md and BACKEND_TODO.md. Plan Phase 1 (DB & Auth). List files you'll create, the models, and open questions. Don't write code yet.
- Layering: api → services → db. No SQL in route handlers.
- EVERY chunk/note query must filter by user_id.
- Async SQLAlchemy 2.0 style only. Pydantic v2.
- TypeScript strict, no `any`. Server state in React Query only.
- Never log note contents or secrets.
- After changing backend schemas, run `npm run gen:api` in frontend.
- Add tests with every feature. Don't finish with failing tests/lint/types. 
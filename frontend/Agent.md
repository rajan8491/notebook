## The tech stack for frontend:
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

## The file structure for frontend

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

## The Core Workflow: Plan → Build → Verify → Commit

1. **Plan first** (plan mode / "don't write code yet"):
   > Read docs/ARCHITECTURE.md and FRONTEND_TODO.md. Plan current Phase. List files you'll create, the models, and open questions. Don't write code yet.
2. **Review the plan**, correct it, then approve.
3. **Use git branches/worktrees** per task so you can discard bad attempts. Commit often.
4. **Implement in small slices**, one TODO section at a time, not "build the whole frontend".
5. **Verify**: agent runs tests, linter, type-check. Ask it to fix failures itself.
6. **Review the diff** yourself. You are the reviewer.
7. **Commit** on a feature branch with a clear message; tick the TODO.
8. Start a fresh session (or `/clear`) between unrelated tasks to keep context clean.
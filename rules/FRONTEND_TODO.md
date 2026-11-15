# Frontend TODO (React, TypeScript, React Query, Tailwind)

Legend: `[ ]` todo · priority **P0** (MVP) / **P1** (soon) / **P2** (later)

## Phase 0: Setup
- [x] **P0** `npm create vite@latest` (React + TS), enable `"strict": true`
- [x] **P0** Install: `@tanstack/react-query @tanstack/react-router react-hook-form zod @hookform/resolvers`
- [x] **P0** Tailwind CSS + shadcn/ui init (dark mode via class)
- [x] **P0** ESLint + Prettier + path alias `@/`
- [x] **P0** `.env` handling (`VITE_API_URL`)
- [x] **P0** Generate typed API client from FastAPI OpenAPI (`orval` / `openapi-typescript`) + npm script `gen:api`
- [x] **P0** Axios/fetch wrapper: auth header, 401 → refresh token → retry, error normalization
- [x] **P0** QueryClient defaults (staleTime, retry rules), query key factory
- [ ] **P1** Vitest + Testing Library + MSW; Playwright for e2e
- [ ] **P1** CI: lint, typecheck, test, build

## Phase 1: App Shell & Auth
- [ ] **P0** Router with protected routes + layout (sidebar, top bar, content area)
- [ ] **P0** Login / Register pages with zod validation
- [ ] **P0** Auth provider (token storage, current user query, logout)
- [ ] **P0** Global error boundary, 404 page, toast system
- [ ] **P0** Responsive layout (mobile drawer for sidebar)
- [ ] **P1** Theme toggle, skeleton loaders, empty states
- [ ] **P2** Google OAuth button

## Phase 2: Notes Library
- [ ] **P0** Sidebar: notebooks list + create/rename/delete
- [ ] **P0** Notes list (cards/table) with infinite query or pagination
- [ ] **P0** Search/filter by title, source type, status
- [ ] **P0** Status badge per note (`pending/processing/ready/failed`) with polling via React Query `refetchInterval` while processing
- [ ] **P0** Delete confirm dialog with optimistic update + rollback
- [ ] **P1** Tags, sort options, bulk select/delete
- [ ] **P1** Trash / restore

## Phase 3: Editor (create own notes)
- [ ] **P0** TipTap editor: headings, bold/italic, lists, code, quote, links, tables
- [ ] **P0** Title field + notebook picker
- [ ] **P0** Debounced autosave (e.g. 1.5s) with "Saving… / Saved" indicator
- [ ] **P0** Unsaved-changes guard on navigation
- [ ] **P0** Store editor JSON + export markdown for backend `content_md`
- [ ] **P1** Slash commands, markdown shortcuts, placeholder
- [ ] **P1** Handle offline / failed save with retry
- [ ] **P2** Image paste/upload, math (KaTeX), version history

## Phase 4: Add Notes from Sources
- [ ] **P0** "Add note" dialog with tabs: Write · Upload file · Paste URL · Paste text
- [ ] **P0** Drag-and-drop upload (PDF, DOCX, MD, TXT) with client-side type/size checks
- [ ] **P0** Upload progress + per-file status list
- [ ] **P0** URL input validation
- [ ] **P1** Multi-file upload queue, cancel/retry
- [ ] **P1** YouTube link source
- [ ] **P1** Note viewer page (rendered content, source info, re-process button on failure)
- [ ] **P2** Browser extension / web clipper

## Phase 5: Chat UI
- [ ] **P0** Chat page: conversation list + message thread + composer
- [ ] **P0** SSE streaming (`fetch-event-source`) with incremental render, stop button
- [ ] **P0** Markdown rendering with code highlighting
- [ ] **P0** Citations: inline `[1]` markers → chips; click opens note panel highlighted at chunk
- [ ] **P0** Scope selector (this note / notebook / all notes)
- [ ] **P0** Loading, error, retry states; disable send while streaming
- [ ] **P0** Auto-scroll with "jump to latest" when user scrolls up
- [ ] **P1** "Chat with this note" button from note page (side panel)
- [ ] **P1** Edit/regenerate last message, copy answer, thumbs up/down feedback
- [ ] **P1** Conversation rename/delete, optimistic updates
- [ ] **P1** Suggested questions after note upload
- [ ] **P2** Study tools UI: summary, flashcards, quiz
- [ ] **P2** Voice input

## Phase 6: Search
- [ ] **P1** Global command palette (`Cmd+K`): notes, conversations
- [ ] **P1** Semantic search page using `/search` with highlighted snippets

## Phase 7: Settings
- [ ] **P1** Profile, change password
- [ ] **P1** Usage / quota display
- [ ] **P1** Export data, delete account

## Phase 8: Quality
- [ ] **P0** Accessibility: keyboard nav, focus rings, ARIA on dialogs/chat, color contrast
- [ ] **P0** Type-safe everywhere (no `any`), zod parse for external data
- [ ] **P1** Unit tests for hooks/utilities; component tests for upload, editor save, chat stream (MSW mocked SSE)
- [ ] **P1** E2E: register → upload note → wait ready → ask question → see citation
- [ ] **P1** Code-splitting (lazy-load editor and chat routes), bundle analysis
- [ ] **P1** Sentry for frontend errors
- [ ] **P2** PWA, i18n

## Conventions
- Feature folders: `features/<name>/{components,hooks,api,tests}`
- Server data only in React Query; Zustand only for UI state
- Query keys from one factory; invalidate narrowly after mutations
- Never `dangerouslySetInnerHTML` without DOMPurify
- Components < ~200 lines; extract hooks for logic

## Definition of Done (per task)
- Typed, lint clean, loading/empty/error states handled, responsive, keyboard accessible, test added for non-trivial logic.

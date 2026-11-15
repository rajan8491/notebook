// Query key factory — single source of truth for all React Query keys.
// Use these everywhere: in queries, invalidations, and prefetches.

export const queryKeys = {
  // Auth
  currentUser: () => ['currentUser'] as const,

  // Notebooks
  notebooks: () => ['notebooks'] as const,
  notebook: (id: string) => ['notebooks', id] as const,

  // Notes
  notes: (params?: { notebookId?: string; q?: string }) =>
    params ? (['notes', params] as const) : (['notes'] as const),
  note: (id: string) => ['notes', id] as const,
  noteStatus: (id: string) => ['notes', id, 'status'] as const,

  // Conversations
  conversations: () => ['conversations'] as const,
  conversation: (id: string) => ['conversations', id] as const,
  messages: (conversationId: string) => ['conversations', conversationId, 'messages'] as const,

  // Search
  search: (query: string, scope?: unknown) => ['search', query, scope] as const,
} as const

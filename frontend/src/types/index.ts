// Shared TypeScript types that span multiple features.
// Feature-specific types live in features/<name>/types.ts.

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
}

export type NoteStatus = 'pending' | 'processing' | 'ready' | 'failed'

export type SourceType = 'editor' | 'pdf' | 'docx' | 'url' | 'text' | 'youtube'

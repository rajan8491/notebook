import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

// ---------------------------------------------------------------------------
// Token storage helpers (memory-first; refresh cookie is httpOnly)
// ---------------------------------------------------------------------------
let _accessToken: string | null = null

export const tokenStorage = {
  get: () => _accessToken,
  set: (t: string | null) => {
    _accessToken = t
  },
  clear: () => {
    _accessToken = null
  },
}

// ---------------------------------------------------------------------------
// Axios instance
// ---------------------------------------------------------------------------
export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send httpOnly refresh cookie
  headers: { 'Content-Type': 'application/json' },
})

// ---------------------------------------------------------------------------
// Request interceptor — attach access token
// ---------------------------------------------------------------------------
apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.get()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ---------------------------------------------------------------------------
// Response interceptor — 401 → try refresh → retry once
// ---------------------------------------------------------------------------
let _refreshPromise: Promise<string> | null = null

apiClient.interceptors.response.use(
  (res) => res,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error)

    const originalRequest = error.config
    if (!originalRequest) return Promise.reject(error)

    const status = error.response?.status

    // Only attempt refresh on 401 and only once per original request
    if (status !== 401 || (originalRequest as { _retry?: boolean })._retry) {
      return Promise.reject(normalizeError(error))
    }

    ;(originalRequest as { _retry?: boolean })._retry = true

    try {
      // Deduplicate concurrent refreshes
      if (!_refreshPromise) {
        _refreshPromise = axios
          .post<{ access_token: string }>(`${BASE_URL}/auth/refresh`, null, {
            withCredentials: true,
          })
          .then((r) => r.data.access_token)
          .finally(() => {
            _refreshPromise = null
          })
      }

      const newToken = await _refreshPromise
      tokenStorage.set(newToken)
      originalRequest.headers.Authorization = `Bearer ${newToken}`
      return apiClient(originalRequest)
    } catch {
      tokenStorage.clear()
      // Let the app react to auth loss via a custom event
      window.dispatchEvent(new Event('auth:logout'))
      return Promise.reject(normalizeError(error))
    }
  },
)

// ---------------------------------------------------------------------------
// Error normalization — convert Axios errors to plain Error with status
// ---------------------------------------------------------------------------
export interface ApiError extends Error {
  status: number
  detail: string
}

function normalizeError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 0
    const detail =
      (error.response?.data as { detail?: string } | undefined)?.detail ??
      error.message ??
      'Unknown error'
    const e = new Error(detail) as ApiError
    e.status = status
    e.detail = detail
    return e
  }
  const e = new Error('Network error') as ApiError
  e.status = 0
  e.detail = 'Network error'
  return e
}

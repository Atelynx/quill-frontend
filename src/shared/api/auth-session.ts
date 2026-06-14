export const AUTH_STORAGE_KEY = 'quill_auth'
export const UNAUTHORIZED_EVENT = 'quill:unauthorized'

interface StoredToken {
  token?: string
}

export function getStoredToken() {
  const raw = sessionStorage.getItem(AUTH_STORAGE_KEY)
  if (!raw) return null

  try {
    return (JSON.parse(raw) as StoredToken).token ?? null
  } catch {
    sessionStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  }
}

export function clearAuthSession() {
  const hadSession = sessionStorage.getItem(AUTH_STORAGE_KEY) !== null
  sessionStorage.removeItem(AUTH_STORAGE_KEY)

  if (hadSession) {
    window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
  }
}

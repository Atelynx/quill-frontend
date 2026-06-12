import { describe, expect, it, vi } from 'vitest'
import { AUTH_STORAGE_KEY, clearAuthSession, UNAUTHORIZED_EVENT } from './auth-session'

describe('clearAuthSession', () => {
  it('limpia la sesion y notifica una autorizacion fallida', () => {
    const listener = vi.fn()
    sessionStorage.setItem(AUTH_STORAGE_KEY, '{"token":"secret"}')
    window.addEventListener(UNAUTHORIZED_EVENT, listener)

    clearAuthSession()

    expect(sessionStorage.getItem(AUTH_STORAGE_KEY)).toBeNull()
    expect(listener).toHaveBeenCalledOnce()
    window.removeEventListener(UNAUTHORIZED_EVENT, listener)
  })
})

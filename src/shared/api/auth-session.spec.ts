import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  AUTH_STORAGE_KEY,
  clearAuthSession,
  getAuthSession,
  getAuthToken,
  setAuthSession,
  UNAUTHORIZED_EVENT,
} from './auth-session'

const authResponse = {
  accessToken: 'secret',
  user: {
    id: 'user-1',
    fullName: 'Usuario Uno',
    email: 'user@quill.cl',
    role: 'investor' as const,
    watchlist: [],
    availableBalance: 1000,
    reservedBalance: 0,
  },
}

describe('authSession', () => {
  beforeEach(() => {
    clearAuthSession()
    sessionStorage.clear()
  })

  it('mantiene token y perfil solo en memoria', () => {
    setAuthSession(authResponse)

    expect(getAuthToken()).toBe('secret')
    expect(getAuthSession()?.user).toEqual(authResponse.user)
    expect(sessionStorage.getItem(AUTH_STORAGE_KEY)).toBeNull()
  })

  it('limpia la sesion en memoria y notifica una autorizacion fallida', () => {
    const listener = vi.fn()
    setAuthSession(authResponse)
    sessionStorage.setItem(AUTH_STORAGE_KEY, '{"token":"legacy-secret"}')
    window.addEventListener(UNAUTHORIZED_EVENT, listener)

    clearAuthSession()

    expect(getAuthToken()).toBeNull()
    expect(sessionStorage.getItem(AUTH_STORAGE_KEY)).toBeNull()
    expect(listener).toHaveBeenCalledOnce()
    window.removeEventListener(UNAUTHORIZED_EVENT, listener)
  })

  it('elimina sesiones legacy persistidas sin restaurarlas', () => {
    sessionStorage.setItem(AUTH_STORAGE_KEY, '{"token":"legacy-secret"}')

    expect(getAuthSession()).toBeNull()
    expect(sessionStorage.getItem(AUTH_STORAGE_KEY)).toBeNull()
  })
})

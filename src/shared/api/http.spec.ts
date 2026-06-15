import { AxiosError, AxiosHeaders } from 'axios'
import { beforeEach, describe, expect, it } from 'vitest'
import { clearAuthSession, getAuthToken, setAuthSession } from './auth-session'
import { apiClient } from './http'

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

describe('apiClient auth', () => {
  beforeEach(() => {
    clearAuthSession()
  })

  it('obtiene el token desde la sesion centralizada en memoria', async () => {
    setAuthSession(authResponse)

    const response = await apiClient.get('/protected', {
      adapter: async (config) => ({
        config,
        data: null,
        headers: {},
        status: 200,
        statusText: 'OK',
      }),
    })

    expect(response.config.headers.Authorization).toBe('Bearer secret')
  })

  it('limpia la sesion ante una respuesta 401', async () => {
    setAuthSession(authResponse)

    await expect(apiClient.get('/protected', {
      adapter: async (config) => {
        throw new AxiosError(
          'Unauthorized',
          AxiosError.ERR_BAD_REQUEST,
          config,
          undefined,
          {
            config,
            data: null,
            headers: new AxiosHeaders(),
            status: 401,
            statusText: 'Unauthorized',
          },
        )
      },
    })).rejects.toBeInstanceOf(AxiosError)

    expect(getAuthToken()).toBeNull()
  })
})

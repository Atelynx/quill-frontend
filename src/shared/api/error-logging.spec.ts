import axios, { AxiosHeaders } from 'axios'
import { describe, expect, it } from 'vitest'
import { sanitizeError } from './error-logging'

describe('sanitizeError', () => {
  it('omite headers, payloads, query strings y respuesta Axios', () => {
    const error = new axios.AxiosError(
      'Request failed',
      'ERR_BAD_REQUEST',
      {
        headers: new AxiosHeaders({ Authorization: 'Bearer secret' }),
        method: 'post',
        url: '/orders?token=secret',
        data: { password: 'secret' },
      },
      undefined,
      {
        data: { token: 'secret' },
        status: 401,
        statusText: 'Unauthorized',
        headers: {},
        config: { headers: new AxiosHeaders() },
      },
    )

    expect(sanitizeError(error)).toEqual({
      message: 'Request failed',
      status: 401,
      method: 'POST',
      endpoint: '/orders',
    })
  })
})

import axios from 'axios'

export interface SanitizedError {
  message: string
  status?: number
  method?: string
  endpoint?: string
}

export function sanitizeError(error: unknown): SanitizedError {
  if (axios.isAxiosError(error)) {
    return {
      message: error.message,
      status: error.response?.status,
      method: error.config?.method?.toUpperCase(),
      endpoint: error.config?.url?.split('?')[0],
    }
  }

  return {
    message: error instanceof Error ? error.message : 'Error desconocido',
  }
}

export function logError(scope: string, error: unknown) {
  if (import.meta.env.DEV) {
    console.error(scope, sanitizeError(error))
  }
}

import type { ApiErrorBody } from '@/types/auth'

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'https://arrumaifapiflask.vercel.app'

export class ApiError extends Error {
  status: number
  body: ApiErrorBody

  constructor(status: number, body: ApiErrorBody, fallbackMessage: string) {
    super(body.erro ?? body.mensagem ?? fallbackMessage)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, headers, ...rest } = options

  const response = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const text = await response.text()
  const data = text ? (JSON.parse(text) as T | ApiErrorBody) : ({} as T)

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data as ApiErrorBody,
      `Erro na requisição (${response.status})`,
    )
  }

  return data as T
}

export { BASE_URL }

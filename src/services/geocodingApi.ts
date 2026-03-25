import type {
  ApiError,
  GeocodingLocation,
  GeocodingSearchResponse,
  ReverseGeocodingResponse,
} from '../types/geocoding'

const API_BASE_URL = (
  __API_BASE_URL__ || 'http://localhost:3000'
)
  .trim()
  .replace(/\/$/, '')

function buildUrl(path: string, params: Record<string, string | number>) {
  const url = new URL(`${API_BASE_URL}${path}`)

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value))
  })

  return url.toString()
}

function getErrorFromPayload(payloadError: ApiError | undefined, fallbackMessage: string): ApiError {
  if (payloadError?.message) {
    return payloadError
  }

  return {
    code: payloadError?.code ?? 'UNKNOWN_ERROR',
    message: fallbackMessage,
  }
}

function throwApiError(apiError: ApiError): never {
  const error = new Error(apiError.message) as Error & { code?: string }
  error.code = apiError.code
  throw error
}

async function parseJsonResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
  try {
    return (await response.json()) as T
  } catch {
    throwApiError({
      code: 'INVALID_RESPONSE',
      message: fallbackMessage,
    })
  }
}

export async function searchLocations(
  query: string,
  signal?: AbortSignal,
): Promise<GeocodingLocation[]> {
  const response = await fetch(buildUrl('/geocoding/search', { query }), {
    method: 'GET',
    signal,
  })

  const payload = await parseJsonResponse<GeocodingSearchResponse>(
    response,
    'Something went wrong while searching locations',
  )

  if (!response.ok || !payload.success) {
    throwApiError(
      getErrorFromPayload(payload.error, 'Something went wrong while searching locations'),
    )
  }

  if (!Array.isArray(payload.data)) {
    throw new Error('Invalid geocoding response')
  }

  return payload.data
}

export async function reverseGeocode(
  lat: number,
  lng: number,
  signal?: AbortSignal,
): Promise<GeocodingLocation> {
  const response = await fetch(buildUrl('/geocoding/reverse', { lat, lng }), {
    method: 'GET',
    signal,
  })

  const payload = await parseJsonResponse<ReverseGeocodingResponse>(
    response,
    'No nearby location was found',
  )

  if (!response.ok || !payload.success) {
    throwApiError(getErrorFromPayload(payload.error, 'No nearby location was found'))
  }

  if (!payload.data) {
    throw new Error('Invalid geocoding response')
  }

  return payload.data
}

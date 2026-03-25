export interface GeocodingLocation {
  zipCode: string
  city: string
  state: string
  latitude: number
  longitude: number
  displayName: string
}

export interface ApiError {
  code: string
  message: string
}

export interface GeocodingSearchResponse {
  success: boolean
  data: GeocodingLocation[]
  error?: ApiError
}

export interface ReverseGeocodingResponse {
  success: boolean
  data: GeocodingLocation
  error?: ApiError
}

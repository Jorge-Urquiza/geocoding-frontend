import { useEffect, useState } from 'react'
import type { LatLngTuple } from 'leaflet'

import { MapView } from '../../components/MapView/MapView'
import { SearchBox } from '../../components/SearchBox/SearchBox'
import { SelectedLocationCard } from '../../components/SelectedLocationCard/SelectedLocationCard'
import { SuggestionsList } from '../../components/SuggestionsList/SuggestionsList'
import { reverseGeocode, searchLocations } from '../../services/geocodingApi'
import type { GeocodingLocation } from '../../types/geocoding'

const INITIAL_CENTER_USA: LatLngTuple = [39.8283, -98.5795]
const INITIAL_ZOOM = 4
const SELECTED_ZOOM = 10
const MIN_QUERY_LENGTH = 2
const SEARCH_DEBOUNCE_MS = 400
const SEARCH_ERROR_MESSAGE = 'Something went wrong while searching locations'
const REVERSE_ERROR_MESSAGE = 'No nearby location was found'

function getLocationPosition(location: GeocodingLocation): LatLngTuple {
  return [location.latitude, location.longitude]
}

function getErrorMessage(error: unknown, fallbackMessage: string): string {
  return error instanceof Error && error.message ? error.message : fallbackMessage
}

export function GeocodingPage() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<GeocodingLocation[]>([])
  const [selectedLocation, setSelectedLocation] = useState<GeocodingLocation | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [reverseError, setReverseError] = useState<string | null>(null)
  const [reverseLoading, setReverseLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const applySelectedLocation = (location: GeocodingLocation) => {
    setSelectedLocation(location)
    setQuery(location.displayName)
    setSuggestions([])
    setHasSearched(false)
    setSearchError(null)
    setReverseError(null)
  }

  const resetSearchState = () => {
    setSuggestions([])
    setLoading(false)
    setSearchError(null)
    setHasSearched(false)
  }

  useEffect(() => {
    const normalizedQuery = query.trim()
    const hasEnoughCharacters = normalizedQuery.length >= MIN_QUERY_LENGTH
    const selectedDisplayName = selectedLocation?.displayName

    if (!hasEnoughCharacters || normalizedQuery === selectedDisplayName) {
      resetSearchState()
      return
    }

    const controller = new AbortController()
    const timeoutId = window.setTimeout(async () => {
      setLoading(true)
      setSearchError(null)

      try {
        const locations = await searchLocations(normalizedQuery, controller.signal)
        setSuggestions(locations)
        setHasSearched(true)
      } catch (requestError) {
        if (controller.signal.aborted) {
          return
        }

        setSuggestions([])
        setHasSearched(false)
        setSearchError(getErrorMessage(requestError, SEARCH_ERROR_MESSAGE))
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }, SEARCH_DEBOUNCE_MS)

    return () => {
      controller.abort()
      window.clearTimeout(timeoutId)
    }
  }, [query, selectedLocation])

  const handleQueryChange = (value: string) => {
    setQuery(value)
    setReverseError(null)
  }

  const handleClearQuery = () => {
    setQuery('')
    setReverseError(null)
  }

  const handleMapClick = async (position: LatLngTuple) => {
    const [lat, lng] = position

    setReverseLoading(true)
    setReverseError(null)

    try {
      const location = await reverseGeocode(lat, lng)
      applySelectedLocation(location)
    } catch (requestError) {
      setReverseError(getErrorMessage(requestError, REVERSE_ERROR_MESSAGE))
    } finally {
      setReverseLoading(false)
    }
  }

  const markerPosition = selectedLocation ? getLocationPosition(selectedLocation) : null
  const mapCenter = markerPosition ?? INITIAL_CENTER_USA
  const mapZoom = markerPosition ? SELECTED_ZOOM : INITIAL_ZOOM
  const showSuggestions =
    query.trim().length >= MIN_QUERY_LENGTH && (loading || Boolean(searchError) || hasSearched)

  return (
    <main className="relative min-h-full overflow-hidden px-4 py-8 sm:py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,116,144,0.15),_transparent_55%)]" />
      <div className="relative mx-auto max-w-7xl">
        <header className="page-enter mb-8 flex flex-col gap-4 rounded-2xl border border-white/60 bg-white/75 p-6 shadow-[0_20px_60px_-40px_rgba(14,116,144,0.8)] backdrop-blur-md md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-800">
              US Location Finder
            </span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Find a place and see it on the map
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
              Search by city, state, or ZIP code. Pick a result to center the map and add a marker.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Current</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {selectedLocation ? selectedLocation.displayName : 'None'}
            </p>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[390px,1fr]">
          <section className="space-y-4">
            <div className="surface-card page-enter stagger-1 relative z-30 rounded-2xl p-5">
              <div className="mb-4">
                <p className="text-sm font-semibold text-slate-900">Find a location</p>
                <p className="mt-1 text-xs text-slate-500">
                  Type a city, state, or ZIP code to get suggestions.
                </p>
              </div>
              <div className="relative">
                <SearchBox
                  query={query}
                  loading={loading}
                  onQueryChange={handleQueryChange}
                  onClear={handleClearQuery}
                />
                <SuggestionsList
                  suggestions={suggestions}
                  loading={loading}
                  error={searchError}
                  showNoResults={hasSearched && suggestions.length === 0}
                  visible={showSuggestions}
                  onSelect={applySelectedLocation}
                />
              </div>
            </div>

            <div className="relative z-10">
              <SelectedLocationCard location={selectedLocation} />
            </div>
          </section>

          <section className="surface-card page-enter stagger-3 rounded-2xl p-3 sm:p-4">
            <div className="mb-3 flex items-center justify-between px-1">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Interactive map
              </p>
              <p className="text-xs text-slate-500">
                {selectedLocation ? `Zoom ${mapZoom}` : 'Default view'}
              </p>
            </div>
            <div className="mb-3 px-1">
              <p className="text-xs text-slate-500">Click on the map to find the nearest place.</p>
              {reverseLoading && (
                <p className="mt-1 text-xs font-semibold text-cyan-700">Finding nearby place...</p>
              )}
              {!reverseLoading && reverseError && (
                <p className="mt-1 text-xs font-semibold text-amber-700">{reverseError}</p>
              )}
            </div>
            <MapView
              center={mapCenter}
              zoom={mapZoom}
              markerPosition={markerPosition}
              markerLabel={selectedLocation?.displayName}
              onMapClick={handleMapClick}
            />
          </section>
        </div>
      </div>
    </main>
  )
}

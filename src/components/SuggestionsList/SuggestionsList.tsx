import type { GeocodingLocation } from '../../types/geocoding'

interface SuggestionsListProps {
  suggestions: GeocodingLocation[]
  loading: boolean
  error: string | null
  showNoResults: boolean
  visible: boolean
  onSelect: (location: GeocodingLocation) => void
}

export function SuggestionsList({
  suggestions,
  loading,
  error,
  showNoResults,
  visible,
  onSelect,
}: SuggestionsListProps) {
  if (!visible) {
    return null
  }

  const hasSuggestions = suggestions.length > 0

  return (
    <div className="absolute left-0 right-0 top-full z-[1000] mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white/95 shadow-[0_14px_36px_-20px_rgba(15,23,42,0.45)] backdrop-blur-sm">
      {loading && <p className="px-4 py-3 text-sm font-medium text-slate-600">Searching locations...</p>}

      {!loading && error && <p className="px-4 py-3 text-sm font-medium text-red-600">{error}</p>}

      {!loading && !error && showNoResults && (
        <p className="px-4 py-3 text-sm font-medium text-slate-600">No results found</p>
      )}

      {!loading && !error && hasSuggestions && (
        <ul className="max-h-72 overflow-y-auto py-1">
          {suggestions.map((location) => (
            <li key={`${location.zipCode}-${location.latitude}-${location.longitude}`}>
              <button
                type="button"
                onClick={() => onSelect(location)}
                className="block w-full border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-cyan-50/60"
              >
                <p className="text-sm font-semibold text-slate-800">{location.displayName}</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {location.city}, {location.state} {location.zipCode}
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

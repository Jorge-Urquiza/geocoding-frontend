interface SearchBoxProps {
  query: string
  loading: boolean
  onQueryChange: (value: string) => void
  onClear: () => void
}

export function SearchBox({ query, loading, onQueryChange, onClear }: SearchBoxProps) {
  return (
    <div>
      <label htmlFor="location-query" className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
        Search location
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </span>
        <input
          id="location-query"
          type="text"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Type a city, state, or ZIP code"
          className="soft-ring w-full rounded-xl border border-slate-200 bg-white/90 px-10 py-3 pr-24 text-sm font-medium text-slate-900 outline-none transition focus:border-cyan-300 focus:bg-white"
        />
        {!loading && query.length > 0 && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
        {loading && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-cyan-50 px-2 py-1 text-[11px] font-semibold text-cyan-700">
            Searching
          </span>
        )}
      </div>
      <p className="mt-2 text-xs text-slate-500">Enter at least 2 characters</p>
    </div>
  )
}

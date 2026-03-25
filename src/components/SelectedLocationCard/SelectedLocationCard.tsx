import type { GeocodingLocation } from '../../types/geocoding'

interface SelectedLocationCardProps {
  location: GeocodingLocation | null
}

export function SelectedLocationCard({ location }: SelectedLocationCardProps) {
  return (
    <section className="surface-card page-enter stagger-2 rounded-2xl p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
          Selected location
        </h2>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
          {location ? 'Ready' : 'Waiting'}
        </span>
      </div>

      {!location && (
        <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-4">
          <p className="text-sm text-slate-600">
            Select a location from search results to see details.
          </p>
        </div>
      )}

      {location && (
        <>
          <p className="mt-4 rounded-xl bg-cyan-50/70 px-3 py-2 text-sm font-semibold text-cyan-800">
            {location.displayName}
          </p>
          <dl className="mt-4 grid grid-cols-1 gap-2 text-sm text-slate-700 sm:grid-cols-2">
            <div className="rounded-lg bg-slate-50 px-3 py-2">
              <dt className="font-medium text-slate-500">City</dt>
              <dd className="mt-1">{location.city}</dd>
            </div>
            <div className="rounded-lg bg-slate-50 px-3 py-2">
              <dt className="font-medium text-slate-500">State</dt>
              <dd className="mt-1">{location.state}</dd>
            </div>
            <div className="rounded-lg bg-slate-50 px-3 py-2">
              <dt className="font-medium text-slate-500">Zip code</dt>
              <dd className="mt-1">{location.zipCode}</dd>
            </div>
            <div className="rounded-lg bg-slate-50 px-3 py-2">
              <dt className="font-medium text-slate-500">Latitude</dt>
              <dd className="mt-1 font-mono text-[13px]">{location.latitude}</dd>
            </div>
            <div className="rounded-lg bg-slate-50 px-3 py-2 sm:col-span-2">
              <dt className="font-medium text-slate-500">Longitude</dt>
              <dd className="mt-1 font-mono text-[13px]">{location.longitude}</dd>
            </div>
          </dl>
        </>
      )}
    </section>
  )
}

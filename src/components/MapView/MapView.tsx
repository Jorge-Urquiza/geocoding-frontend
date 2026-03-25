import { useEffect } from 'react'
import L, { type LatLngTuple } from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

interface MapViewProps {
  center: LatLngTuple
  zoom: number
  markerPosition: LatLngTuple | null
  markerLabel?: string
  onMapClick?: (position: LatLngTuple) => void
}

function RecenterMap({ center, zoom }: { center: LatLngTuple; zoom: number }) {
  const map = useMap()

  useEffect(() => {
    map.setView(center, zoom, { animate: true })
  }, [center, zoom, map])

  return null
}

function MapClickHandler({ onMapClick }: { onMapClick?: (position: LatLngTuple) => void }) {
  useMapEvents({
    click(event) {
      if (!onMapClick) {
        return
      }

      onMapClick([event.latlng.lat, event.latlng.lng])
    },
  })

  return null
}

export function MapView({ center, zoom, markerPosition, markerLabel, onMapClick }: MapViewProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom
      className="h-[460px] w-full rounded-2xl sm:h-[540px] lg:h-[620px]"
    >
      <RecenterMap center={center} zoom={zoom} />
      <MapClickHandler onMapClick={onMapClick} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markerPosition && (
        <Marker position={markerPosition}>
          <Popup>{markerLabel ?? 'Selected location'}</Popup>
        </Marker>
      )}
    </MapContainer>
  )
}

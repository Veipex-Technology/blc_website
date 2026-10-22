"use client";

import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const markerIcon = new L.Icon({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

type ContactMapProps = {
  address: string;
  latitude: number;
  longitude: number;
  coordinatesConfirmed: boolean;
  mapLabel: string;
  coordinatesPendingLabel: string;
};

export function ContactMap({
  address,
  latitude,
  longitude,
  coordinatesConfirmed,
  mapLabel,
  coordinatesPendingLabel,
}: ContactMapProps) {
  const position: [number, number] = [latitude, longitude];

  return (
    <div
      className="h-full min-h-[280px] w-full"
      aria-label={mapLabel}
      role="region"
    >
      <MapContainer
        center={position}
        zoom={16}
        scrollWheelZoom
        className="h-full min-h-[280px] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={markerIcon}>
          <Popup>
            <div className="grid gap-1 text-sm leading-relaxed">
              <strong>{mapLabel}</strong>
              <span>{address}</span>
              {!coordinatesConfirmed && (
                <span className="text-xs text-[var(--blc-gold-500)]">
                  {coordinatesPendingLabel}
                </span>
              )}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

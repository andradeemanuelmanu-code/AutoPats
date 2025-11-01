import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import { useEffect } from "react";

// Ícones para o mapa
const userLocationSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#dc2626" width="32" height="32"><circle cx="12" cy="12" r="8" fill-opacity="0.7"/><circle cx="12" cy="12" r="8" stroke="#fff" stroke-width="2"><animate attributeName="r" from="8" to="12" dur="1.5s" begin="0s" repeatCount="indefinite"/><animate attributeName="opacity" from="1" to="0" dur="1.5s" begin="0s" repeatCount="indefinite"/></circle></svg>`;
const userLocationIcon = new L.DivIcon({ html: userLocationSvg, className: '', iconSize: [32, 32], iconAnchor: [16, 16] });

const createNumberedIcon = (number: number) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 42" width="32" height="42">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 8.837 16 26 16 26s16-17.163 16-26C32 7.163 24.837 0 16 0z" fill="#3b82f6"/>
      <circle cx="16" cy="16" r="12" fill="white"/>
      <text x="16" y="21" font-size="16" font-weight="bold" text-anchor="middle" fill="#3b82f6">${number}</text>
    </svg>`;
  return new L.DivIcon({
    html: svg,
    className: '',
    iconSize: [32, 42],
    iconAnchor: [16, 42],
  });
};

// Componente para ajustar a visão do mapa
const ChangeView = ({ bounds }: { bounds: L.LatLngBoundsExpression | null }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.flyToBounds(bounds, { padding: [50, 50], animate: true, duration: 1 });
    }
  }, [bounds, map]);
  return null;
};

export const RouteMap = ({ orderedCustomers, outboundRoute, returnRoute, userLocation }) => {
  const center: L.LatLngExpression = [-14.235004, -51.92528];

  const routeBounds = outboundRoute && returnRoute
    ? L.latLngBounds([...outboundRoute, ...returnRoute])
    : null;

  return (
    <MapContainer center={center} zoom={4} style={{ height: '100%', width: '100%' }}>
      <ChangeView bounds={routeBounds} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {orderedCustomers && orderedCustomers.map((customer) => (
        <Marker
          key={customer.id}
          position={[customer.lat, customer.lng]}
          icon={createNumberedIcon(customer.sequence)}
        />
      ))}
      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={userLocationIcon}
        />
      )}
      {outboundRoute && <Polyline pathOptions={{ color: 'blue' }} positions={outboundRoute} />}
      {returnRoute && <Polyline pathOptions={{ color: 'red', dashArray: '5, 10' }} positions={returnRoute} />}
    </MapContainer>
  );
};
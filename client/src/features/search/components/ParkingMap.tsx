import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { type ParkingSpotData } from '../search.service';

interface ParkingMapProps {
  parkingSpots: ParkingSpotData[];
  activeSpotId: string | null;
  onMarkerHover: (id: string | null) => void;
  onMarkerClick: (id: string) => void;
}

// Custom hook to handle map recentering
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 0.5 });
  }, [center, zoom, map]);
  return null;
}

export function ParkingMap({ parkingSpots, activeSpotId, onMarkerHover, onMarkerClick }: ParkingMapProps) {
  // Center roughly on New Delhi based on dummy data
  const center: [number, number] = parkingSpots.length > 0 
    ? [parkingSpots[0].lat, parkingSpots[0].lng] 
    : [28.6139, 77.2090];

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-secondary-200 dark:border-[#4d4635] shadow-sm relative z-0 parking-map-wrapper">
      <MapContainer 
        center={center} 
        zoom={14} 
        style={{ height: '100%', width: '100%', zIndex: 1 }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; Google Maps'
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=en&gl=IN"
        />
        
        {parkingSpots.map((spot) => {
          const isActive = spot.id === activeSpotId;
          
          // Create custom HTML icon
          const iconHtml = `
            <div class="relative group cursor-pointer transition-transform duration-300 ${isActive ? 'scale-110 z-50' : 'scale-100 z-10'}">
              <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary-600 rotate-45 ${isActive ? 'bg-warning-400' : ''}"></div>
              <div class="relative px-3 py-1.5 bg-primary-600 text-white font-bold text-sm rounded-lg shadow-md flex items-center justify-center border border-white whitespace-nowrap ${isActive ? 'bg-warning-400 text-white border-white shadow-lg' : ''}">
                ₹${spot.pricePerHour}
              </div>
            </div>
          `;

          const customIcon = L.divIcon({
            html: iconHtml,
            className: 'custom-leaflet-icon bg-transparent border-none',
            iconSize: [60, 30],
            iconAnchor: [30, 30],
          });

          return (
            <Marker 
              key={spot.id} 
              position={[spot.lat, spot.lng]} 
              icon={customIcon}
              eventHandlers={{
                mouseover: () => onMarkerHover(spot.id),
                mouseout: () => onMarkerHover(null),
                click: () => onMarkerClick(spot.id),
              }}
            />
          );
        })}

        {activeSpotId && parkingSpots.find(s => s.id === activeSpotId) && (
          <MapController 
            center={[
              parkingSpots.find(s => s.id === activeSpotId)!.lat, 
              parkingSpots.find(s => s.id === activeSpotId)!.lng
            ]} 
            zoom={15} 
          />
        )}
      </MapContainer>
    </div>
  );
}

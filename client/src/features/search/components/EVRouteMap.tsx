import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { type EVRouteResponse } from '../ev-routing.service';

interface EVRouteMapProps {
  routeData: EVRouteResponse;
  activeStopId?: string | null;
}

// Custom hook to fit bounds to the entire route
function RouteBoundsController({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [points, map]);
  return null;
}

export function EVRouteMap({ routeData, activeStopId }: EVRouteMapProps) {
  // Collect all points to draw the polyline and fit bounds
  const allPoints: [number, number][] = [
    routeData.startCoords,
    ...routeData.stops.map(stop => [stop.latitude, stop.longitude] as [number, number]),
    routeData.endCoords,
  ];

  // Custom icons
  const createStopIcon = (isActive: boolean) => {
    const iconHtml = `
      <div class="relative group cursor-pointer transition-transform duration-300 ${isActive ? 'scale-125 z-50' : 'scale-100 z-10'}">
        <div class="w-8 h-8 rounded-full bg-emerald-100 border-[3px] border-emerald-500 flex items-center justify-center shadow-lg ${isActive ? 'border-warning-400 bg-warning-50 shadow-xl' : ''}">
          <span class="material-symbols-outlined text-[16px] text-emerald-600 ${isActive ? 'text-warning-600' : ''}">ev_station</span>
        </div>
      </div>
    `;

    return L.divIcon({
      html: iconHtml,
      className: 'custom-leaflet-icon bg-transparent border-none',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  const startEndIcon = L.divIcon({
    html: `
      <div class="w-6 h-6 rounded-full bg-white border-[3px] border-secondary-600 flex items-center justify-center shadow-md">
        <span class="w-2 h-2 rounded-full bg-secondary-500"></span>
      </div>
    `,
    className: 'custom-leaflet-icon bg-transparent border-none',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  // Fetch OSRM route
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);

  useEffect(() => {
    async function fetchOSRMRoute() {
      try {
        let fullCoordinates: [number, number][] = [];
        
        // Fetch route in segments to avoid OSRM long-route truncation bugs
        for (let i = 0; i < allPoints.length - 1; i++) {
          const p1 = allPoints[i];
          const p2 = allPoints[i+1];
          const coordinateString = `${p1[1]},${p1[0]};${p2[1]},${p2[0]}`;
          
          const response = await fetch(`https://routing.openstreetmap.de/routed-car/route/v1/driving/${coordinateString}?overview=full&geometries=geojson`);
          if (!response.ok) continue;
          
          const data = await response.json();
          if (data.routes && data.routes.length > 0) {
            const coords = data.routes[0].geometry.coordinates;
            // OSRM returns [lon, lat], Leaflet needs [lat, lon]
            const leafletCoords: [number, number][] = coords.map((c: [number, number]) => [c[1], c[0]]);
            fullCoordinates = [...fullCoordinates, ...leafletCoords];
          }
        }
        
        if (fullCoordinates.length > 0) {
          setRouteCoordinates(fullCoordinates);
        } else {
          setRouteCoordinates(allPoints);
        }
      } catch (error) {
        console.error('Failed to fetch OSRM route:', error);
        // Fallback to straight lines if API fails
        setRouteCoordinates(allPoints);
      }
    }

    fetchOSRMRoute();
  }, [allPoints.map(p => p.join(',')).join(';')]);

  return (
    <div className="w-full h-full rounded-[2rem] overflow-hidden border border-secondary-200 dark:border-[#4d4635] shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none relative z-0 parking-map-wrapper bg-secondary-100 dark:bg-black/20">
      <MapContainer 
        style={{ height: '100%', width: '100%', zIndex: 1 }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; Google Maps'
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=en&gl=IN"
        />
        
        <RouteBoundsController points={allPoints} />

        {routeCoordinates.length > 0 ? (
          <Polyline positions={routeCoordinates} color="#3b82f6" weight={8} opacity={0.9} />
        ) : (
          <Polyline positions={allPoints} color="#3b82f6" weight={6} opacity={0.8} />
        )}

        <Marker position={routeData.startCoords} icon={startEndIcon} />
        
        {routeData.stops.map((stop) => (
          <Marker 
            key={stop.id} 
            position={[stop.latitude, stop.longitude]} 
            icon={createStopIcon(stop.id === activeStopId)}
          />
        ))}

        <Marker position={routeData.endCoords} icon={startEndIcon} />
      </MapContainer>
    </div>
  );
}

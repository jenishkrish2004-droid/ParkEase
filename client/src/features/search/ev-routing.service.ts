// ============================================================
// EV Routing Dynamic Service
// ============================================================

export interface EVChargingStop {
  id: string;
  name: string;
  distanceFromRoute: number; // in km
  chargingSpeed: string; // e.g. "50kW DC Fast"
  connectorTypes: string[]; // e.g. ["CCS2", "CHAdeMO"]
  operatingHours: string;
  payOnSpotAvailable: boolean;
  latitude: number;
  longitude: number;
}

export interface EVRouteResponse {
  source: string;
  destination: string;
  totalDistance: number; // in km
  estimatedTime: string;
  stops: EVChargingStop[];
  startCoords: [number, number]; // [lat, lng]
  endCoords: [number, number]; // [lat, lng]
  routeGeometry: [number, number][]; // [lat, lng] array for Polyline
}

// Helper to format OSRM duration (seconds) to human-readable string
function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h} hrs ${m} mins`;
  return `${m} mins`;
}

// Generate dynamic EV stations along the route geometry
function generateDynamicStations(
  coordinates: [number, number][], // [lon, lat] from OSRM
  totalDistanceKm: number
): EVChargingStop[] {
  // If the route is too short, generate fewer stations.
  const numberOfStations = Math.max(1, Math.min(5, Math.floor(totalDistanceKm / 50)));
  const stations: EVChargingStop[] = [];

  const step = Math.floor(coordinates.length / (numberOfStations + 1));
  if (step < 1) return stations;

  for (let i = 1; i <= numberOfStations; i++) {
    const idx = i * step;
    const coord = coordinates[idx];
    if (!coord) continue;

    // Slightly randomize distance from route (0.1 to 2.5 km)
    const distanceFromRoute = Number((Math.random() * 2.4 + 0.1).toFixed(1));
    
    stations.push({
      id: `dyn-st-${i}`,
      name: `Highway EV Hub ${i}`,
      distanceFromRoute,
      chargingSpeed: i % 2 === 0 ? '60kW DC Fast' : '50kW DC Fast',
      connectorTypes: i % 3 === 0 ? ['CCS2', 'Type 2 AC'] : ['CCS2'],
      operatingHours: i % 2 === 0 ? '24/7' : '6:00 AM - 11:00 PM',
      payOnSpotAvailable: Math.random() > 0.3, // 70% chance true
      latitude: coord[1], // OSRM gives [lon, lat]
      longitude: coord[0],
    });
  }

  return stations;
}

export async function fetchEvRoute(from: string, to: string): Promise<EVRouteResponse> {
  // 1. Geocode "From"
  const fromRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(from)}&format=json&limit=1`);
  const fromData = await fromRes.json();
  if (!fromData || fromData.length === 0) throw new Error(`Could not locate: ${from}`);
  const startLat = parseFloat(fromData[0].lat);
  const startLng = parseFloat(fromData[0].lon);

  // 2. Geocode "To"
  const toRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(to)}&format=json&limit=1`);
  const toData = await toRes.json();
  if (!toData || toData.length === 0) throw new Error(`Could not locate: ${to}`);
  const endLat = parseFloat(toData[0].lat);
  const endLng = parseFloat(toData[0].lon);

  // 3. Get Route via OSRM
  // We use default routing directly. The free OSRM demo server has bugs snapping to 
  // intermediate waypoints in South India, often misrouting destinations to Puducherry.
  // We accept the route OSRM considers "fastest" by default.
  const routeUrl = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;

  const routeRes = await fetch(routeUrl);
  const routeData = await routeRes.json();

  if (!routeData.routes || routeData.routes.length === 0) {
    throw new Error('No route found between these locations.');
  }

  const route = routeData.routes[0];
  const distanceKm = Math.round(route.distance / 1000);
  const durationSec = route.duration;
  const geometryCoordinates = route.geometry.coordinates as [number, number][]; // [lon, lat] array

  // 4. Generate Stations along the route
  const stations = generateDynamicStations(geometryCoordinates, distanceKm);
  const leafletGeometry: [number, number][] = geometryCoordinates.map(c => [c[1], c[0]]);

  return {
    source: fromData[0].display_name.split(',')[0], // Clean up long names
    destination: toData[0].display_name.split(',')[0],
    totalDistance: distanceKm,
    estimatedTime: formatDuration(durationSec),
    stops: stations,
    startCoords: [startLat, startLng],
    endCoords: [endLat, endLng],
    routeGeometry: leafletGeometry,
  };
}

// ============================================================
// EV Routing Mock Service
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
}

// Mock stations along the popular Nagercoil -> Chennai route
const mockStations: EVChargingStop[] = [
  {
    id: 'st-1',
    name: 'Madurai Highway EV Hub',
    distanceFromRoute: 1.2,
    chargingSpeed: '60kW DC Fast',
    connectorTypes: ['CCS2'],
    operatingHours: '24/7',
    payOnSpotAvailable: true,
    latitude: 9.9252,
    longitude: 78.1198,
  },
  {
    id: 'st-2',
    name: 'Trichy Zeon Charging Station',
    distanceFromRoute: 0.5,
    chargingSpeed: '50kW DC Fast',
    connectorTypes: ['CCS2', 'Type 2 AC'],
    operatingHours: '6:00 AM - 11:00 PM',
    payOnSpotAvailable: true,
    latitude: 10.7905,
    longitude: 78.7047,
  },
  {
    id: 'st-3',
    name: 'Villupuram Express Chargers',
    distanceFromRoute: 2.0,
    chargingSpeed: '30kW DC Fast',
    connectorTypes: ['CCS2'],
    operatingHours: '24/7',
    payOnSpotAvailable: false,
    latitude: 11.9401,
    longitude: 79.4861,
  },
];

export async function fetchEvRoute(from: string, to: string): Promise<EVRouteResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  return {
    source: from,
    destination: to,
    totalDistance: 705, // approx Nagercoil to Chennai
    estimatedTime: '11 hrs 45 mins',
    stops: mockStations,
  };
}

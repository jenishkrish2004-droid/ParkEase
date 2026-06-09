export interface ParkingSpotData {
  id: string;
  name: string;
  pricePerHour: number;
  distanceKm: number;
  availableSpots: number;
  amenities: string[];
  supportedVehicles: string[];
  rating: number;
  reviews: number;
}

export interface EVStationData {
  id: string;
  name: string;
  distanceKm: number;
  connectors: string[];
  chargingSpeed: string;
  payOnSpot: boolean;
  operatingHours: string;
  stationOwner: string;
}

export interface SearchResults {
  parkingSpots: ParkingSpotData[];
  evStations: EVStationData[];
}

export async function fetchSearchResults(query: string): Promise<SearchResults> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // If query is empty, maybe return some default popular ones, but let's just return a standard mock set
  const normalizedQuery = query.trim().toLowerCase();

  // If someone searches for something completely unrelated that we want to show empty states for:
  if (normalizedQuery === 'nowhere' || normalizedQuery === 'empty') {
    return { parkingSpots: [], evStations: [] };
  }

  return {
    parkingSpots: [
      {
        id: 'p1',
        name: 'Express Parking',
        pricePerHour: 50,
        distanceKm: 0.5,
        availableSpots: 20,
        amenities: ['Covered Parking', 'CCTV', '24/7 Access'],
        supportedVehicles: ['Car', 'Bike'],
        rating: 4.8,
        reviews: 124,
      },
      {
        id: 'p2',
        name: 'Central Plaza Garage',
        pricePerHour: 80,
        distanceKm: 1.2,
        availableSpots: 5,
        amenities: ['Covered Parking', 'Security Guard', 'Valet Parking', 'Wheelchair Accessible'],
        supportedVehicles: ['Car'],
        rating: 4.9,
        reviews: 312,
      },
      {
        id: 'p3',
        name: 'Metro Station Valet',
        pricePerHour: 40,
        distanceKm: 2.1,
        availableSpots: 42,
        amenities: ['CCTV', '24/7 Access', 'Multi-Level Parking', 'EV Charging Available'],
        supportedVehicles: ['Car', 'Bike', 'Commercial'],
        rating: 4.2,
        reviews: 89,
      },
    ],
    evStations: [
      {
        id: 'ev1',
        name: 'ChargePoint Chennai',
        distanceKm: 1.2,
        connectors: ['CCS2', 'Type 2'],
        chargingSpeed: 'Fast Charging',
        payOnSpot: true,
        operatingHours: '24/7',
        stationOwner: 'ChargePoint',
      },
      {
        id: 'ev2',
        name: 'Tata Power EZ Charge',
        distanceKm: 2.8,
        connectors: ['CCS2'],
        chargingSpeed: 'Ultra Fast',
        payOnSpot: true,
        operatingHours: '6:00 AM - 11:00 PM',
        stationOwner: 'Tata Power',
      },
    ],
  };
}

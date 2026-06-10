import { apiClient } from '@/lib/api-client';

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
  images: string[];
  lat: number;
  lng: number;
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
  const normalizedQuery = query.trim().toLowerCase();

  if (normalizedQuery === 'nowhere' || normalizedQuery === 'empty') {
    return { parkingSpots: [], evStations: [] };
  }

  try {
    const response = await apiClient.get('/parking-spots/search', {
      params: { q: query },
    });
    
    const dbSpots = response.data.data.spots || [];
    
    // Map DB spots to the frontend structure
    const mappedSpots: ParkingSpotData[] = dbSpots.map((spot: any) => ({
      id: spot.id,
      name: spot.title,
      pricePerHour: spot.pricePerHour || 50,
      distanceKm: 2.5, // Dummy distance until we add actual geolocation sorting
      availableSpots: spot.availableSlots,
      amenities: spot.amenities?.map((a: any) => a.amenity) || [],
      supportedVehicles: spot.vehicleTypes?.map((v: any) => 
        v.vehicleType === 'CAR' ? 'Car' : 
        v.vehicleType === 'BIKE' ? 'Bike' : 
        v.vehicleType
      ) || ['Car'],
      rating: spot.averageRating || 4.5,
      reviews: spot.totalReviews || 0,
      images: spot.images?.map((img: any) => img.url) || ['https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=600&auto=format&fit=crop'],
      lat: spot.latitude,
      lng: spot.longitude,
    }));

    return {
      parkingSpots: mappedSpots,
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
      ],
    };
  } catch (error) {
    console.error('Search error:', error);
    return { parkingSpots: [], evStations: [] };
  }
}

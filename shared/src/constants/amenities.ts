// ============================================================
// Parking Spot Amenities
// ============================================================

export const Amenity = {
  CCTV: 'CCTV',
  WATCHMAN: 'WATCHMAN',
  GATED: 'GATED',
  COVERED_PARKING: 'COVERED_PARKING',
  SHED_COVER: 'SHED_COVER',
  EV_CHARGING: 'EV_CHARGING',
  LIGHTING: 'LIGHTING',
  FULL_DAY_ACCESS: 'FULL_DAY_ACCESS',
} as const;

export type Amenity = (typeof Amenity)[keyof typeof Amenity];

export const AmenityLabels: Record<Amenity, string> = {
  CCTV: 'CCTV',
  WATCHMAN: 'Watchman',
  GATED: 'Gated',
  COVERED_PARKING: 'Covered Parking',
  SHED_COVER: 'Shed Cover',
  EV_CHARGING: 'EV Charging',
  LIGHTING: 'Lighting',
  FULL_DAY_ACCESS: '24/7 Access',
};

export const AmenityIcons: Record<Amenity, string> = {
  CCTV: '📹',
  WATCHMAN: '👮',
  GATED: '🚧',
  COVERED_PARKING: '🏗️',
  SHED_COVER: '⛺',
  EV_CHARGING: '⚡',
  LIGHTING: '💡',
  FULL_DAY_ACCESS: '🕐',
};

export const ALL_AMENITIES = Object.values(Amenity);

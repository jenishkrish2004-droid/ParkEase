// ============================================================
// Vehicle Types
// ============================================================

export const VehicleType = {
  CAR: 'CAR',
  BIKE: 'BIKE',
  EV: 'EV',
} as const;

export type VehicleType = (typeof VehicleType)[keyof typeof VehicleType];

export const VehicleTypeLabels: Record<VehicleType, string> = {
  CAR: 'Car',
  BIKE: 'Bike',
  EV: 'Electric Vehicle',
};

export const VehicleTypeIcons: Record<VehicleType, string> = {
  CAR: '🚗',
  BIKE: '🏍️',
  EV: '🔋',
};

export const ALL_VEHICLE_TYPES = Object.values(VehicleType);

import { cn } from '@/lib/utils';

export type VehicleType = 'Car' | 'Bike';

interface VehicleTypeSelectorProps {
  selectedVehicle: VehicleType;
  onVehicleChange: (vehicle: VehicleType) => void;
}

const VEHICLE_TYPES: { type: VehicleType; icon: string }[] = [
  { type: 'Car', icon: 'directions_car' },
  { type: 'Bike', icon: 'two_wheeler' },
];

export function VehicleTypeSelector({ selectedVehicle, onVehicleChange }: VehicleTypeSelectorProps) {
  return (
    <div className="flex w-full bg-secondary-100 dark:bg-[#1a1712] p-1 rounded-xl border border-secondary-200 dark:border-[#4d4635] shadow-sm">
      {VEHICLE_TYPES.map(({ type, icon }) => (
        <button
          key={type}
          onClick={() => onVehicleChange(type)}
          className={cn(
            "relative flex-1 flex flex-col sm:flex-row items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg font-semibold text-xs transition-all duration-300 z-10",
            selectedVehicle === type
              ? "text-[#3c2f00] dark:text-[#3c2f00] bg-primary-400 dark:bg-[#f2ca50] shadow-md dark:shadow-[0_0_15px_rgba(242,202,80,0.4)] border border-primary-500/20"
              : "text-secondary-600 dark:text-[#d0c5af] hover:text-secondary-900 dark:hover:text-white hover:bg-secondary-200/50 dark:hover:bg-white/5"
          )}
        >
          <span className="material-symbols-outlined text-[16px]">{icon}</span>
          <span className="hidden sm:inline">{type}</span>
        </button>
      ))}
    </div>
  );
}

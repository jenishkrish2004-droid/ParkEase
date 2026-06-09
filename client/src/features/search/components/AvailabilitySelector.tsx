import { useState } from 'react';
import { cn } from '@/lib/utils';
import { DatePickerPopup } from '@/components/ui/DatePickerPopup';

interface AvailabilitySelectorProps {
  selectedDate: string;
  selectedTime: string;
  durationHours: number;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onDurationChange: (hours: number) => void;
}

export function AvailabilitySelector({
  selectedDate,
  selectedTime,
  durationHours,
  onDateChange,
  onTimeChange,
  onDurationChange,
}: AvailabilitySelectorProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Time options
  const timeOptions = [];
  for (let i = 0; i < 24; i++) {
    const hour = i % 12 || 12;
    const ampm = i < 12 ? 'AM' : 'PM';
    timeOptions.push(`${hour}:00 ${ampm}`);
    timeOptions.push(`${hour}:30 ${ampm}`);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 w-full bg-white/60 dark:bg-[#1a1712]/60 p-3 rounded-2xl border border-secondary-200 dark:border-[#4d4635] shadow-sm backdrop-blur-md">
      {/* Date Picker */}
      <div className="relative w-full sm:w-auto flex-1">
        <button
          onClick={() => setShowDatePicker(!showDatePicker)}
          className={cn(
            "w-full flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all duration-300",
            showDatePicker
              ? "border-primary-500 bg-primary-50 dark:bg-[#f2ca50]/10 dark:border-[#f2ca50]/50 text-primary-700 dark:text-[#f2ca50]"
              : "border-secondary-200 dark:border-[#4d4635] hover:border-primary-300 dark:hover:border-[#f2ca50]/50 bg-white dark:bg-[#110e07] text-secondary-900 dark:text-[#eae1d4]"
          )}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            <span className="text-sm font-medium">
              {selectedDate ? new Date(selectedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Any Date'}
            </span>
          </div>
          <span className="material-symbols-outlined text-[18px]">expand_more</span>
        </button>
        {showDatePicker && (
          <div className="absolute top-full left-0 mt-2 z-50">
            <DatePickerPopup
              selectedDate={selectedDate}
              onSelectDate={(date) => {
                onDateChange(date);
                setShowDatePicker(false);
              }}
              onClose={() => setShowDatePicker(false)}
            />
          </div>
        )}
      </div>

      <div className="w-px h-10 bg-secondary-200 dark:bg-[#4d4635] hidden sm:block"></div>

      {/* Time Picker */}
      <div className="relative w-full sm:w-auto flex-1">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-secondary-200 dark:border-[#4d4635] bg-white dark:bg-[#110e07] focus-within:border-primary-500 dark:focus-within:border-[#f2ca50]/50 transition-colors">
          <span className="material-symbols-outlined text-[18px] text-secondary-500 dark:text-[#d0c5af]">schedule</span>
          <select
            value={selectedTime}
            onChange={(e) => onTimeChange(e.target.value)}
            className="w-full bg-transparent border-none text-sm font-medium text-secondary-900 dark:text-[#eae1d4] focus:ring-0 cursor-pointer appearance-none outline-none"
          >
            {timeOptions.map(time => (
              <option key={time} value={time} className="text-secondary-900 dark:text-[#eae1d4] dark:bg-[#110e07]">{time}</option>
            ))}
          </select>
          <span className="material-symbols-outlined text-[18px] text-secondary-500 dark:text-[#d0c5af] pointer-events-none">expand_more</span>
        </div>
      </div>

      <div className="w-px h-10 bg-secondary-200 dark:bg-[#4d4635] hidden sm:block"></div>

      {/* Duration Picker */}
      <div className="relative w-full sm:w-auto flex-1">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-secondary-200 dark:border-[#4d4635] bg-white dark:bg-[#110e07] focus-within:border-primary-500 dark:focus-within:border-[#f2ca50]/50 transition-colors">
          <span className="material-symbols-outlined text-[18px] text-secondary-500 dark:text-[#d0c5af]">timer</span>
          <select
            value={durationHours}
            onChange={(e) => onDurationChange(Number(e.target.value))}
            className="w-full bg-transparent border-none text-sm font-medium text-secondary-900 dark:text-[#eae1d4] focus:ring-0 cursor-pointer appearance-none outline-none"
          >
            {[1, 2, 3, 4, 5, 6, 8, 12, 24].map(hours => (
              <option key={hours} value={hours} className="text-secondary-900 dark:text-[#eae1d4] dark:bg-[#110e07]">
                {hours} {hours === 1 ? 'Hour' : 'Hours'}
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined text-[18px] text-secondary-500 dark:text-[#d0c5af] pointer-events-none">expand_more</span>
        </div>
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
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
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDurationPicker, setShowDurationPicker] = useState(false);

  const timeRef = useRef<HTMLDivElement>(null);
  const durationRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (timeRef.current && !timeRef.current.contains(event.target as Node)) setShowTimePicker(false);
      if (durationRef.current && !durationRef.current.contains(event.target as Node)) setShowDurationPicker(false);
      if (dateRef.current && !dateRef.current.contains(event.target as Node)) setShowDatePicker(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Time options
  const timeOptions = [];
  for (let i = 0; i < 24; i++) {
    const hour = i % 12 || 12;
    const ampm = i < 12 ? 'AM' : 'PM';
    timeOptions.push(`${hour}:00 ${ampm}`);
    timeOptions.push(`${hour}:30 ${ampm}`);
  }

  const durationOptions = [1, 2, 3, 4, 5, 6, 8, 12, 24];

  return (
    <div className="relative z-20 flex flex-col gap-2.5 w-full bg-white/60 dark:bg-[#1a1712]/60 p-3 rounded-2xl border border-secondary-200 dark:border-[#4d4635] shadow-sm backdrop-blur-md">
      {/* Date Picker */}
      <div className="relative w-full" ref={dateRef}>
        <button
          onClick={() => setShowDatePicker(!showDatePicker)}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2 rounded-xl border transition-all duration-300",
            showDatePicker
              ? "border-primary-500 bg-primary-50 dark:bg-[#f2ca50]/10 dark:border-[#f2ca50]/50 text-primary-700 dark:text-[#f2ca50]"
              : "border-secondary-200 dark:border-[#4d4635] hover:border-primary-300 dark:hover:border-[#f2ca50]/50 bg-white dark:bg-[#252119] text-secondary-900 dark:text-[#eae1d4]"
          )}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">calendar_today</span>
            <span className="text-sm font-medium">
              {selectedDate ? new Date(selectedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Any Date'}
            </span>
          </div>
          <span className="material-symbols-outlined text-[16px]">expand_more</span>
        </button>
        {showDatePicker && (
          <div className="absolute top-full left-0 mt-2 z-50 animate-slide-up origin-top">
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

      {/* Time Picker */}
      <div className="relative w-full" ref={timeRef}>
        <button
          onClick={() => setShowTimePicker(!showTimePicker)}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2 rounded-xl border transition-all duration-300",
            showTimePicker
              ? "border-primary-500 bg-primary-50 dark:bg-[#f2ca50]/10 dark:border-[#f2ca50]/50 text-primary-700 dark:text-[#f2ca50]"
              : "border-secondary-200 dark:border-[#4d4635] hover:border-primary-300 dark:hover:border-[#f2ca50]/50 bg-white dark:bg-[#252119] text-secondary-900 dark:text-[#eae1d4]"
          )}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-secondary-500 dark:text-[#d0c5af]">schedule</span>
            <span className="text-sm font-medium">{selectedTime}</span>
          </div>
          <span className="material-symbols-outlined text-[16px] text-secondary-500 dark:text-[#d0c5af]">expand_more</span>
        </button>
        {showTimePicker && (
          <div className="absolute top-full left-0 mt-2 z-50 w-full max-h-60 overflow-y-auto custom-scrollbar bg-white/95 dark:bg-[#252119]/95 backdrop-blur-md border border-secondary-200 dark:border-[#4d4635] rounded-xl shadow-lg animate-slide-up origin-top p-1">
            {timeOptions.map((time) => (
              <button
                key={time}
                onClick={() => {
                  onTimeChange(time);
                  setShowTimePicker(false);
                }}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  selectedTime === time
                    ? "bg-primary-50 text-primary-700 dark:bg-[#f2ca50]/10 dark:text-[#f2ca50]"
                    : "text-secondary-700 dark:text-[#eae1d4] hover:bg-secondary-50 dark:hover:bg-white/5"
                )}
              >
                {time}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Duration Picker */}
      <div className="relative w-full" ref={durationRef}>
        <button
          onClick={() => setShowDurationPicker(!showDurationPicker)}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2 rounded-xl border transition-all duration-300",
            showDurationPicker
              ? "border-primary-500 bg-primary-50 dark:bg-[#f2ca50]/10 dark:border-[#f2ca50]/50 text-primary-700 dark:text-[#f2ca50]"
              : "border-secondary-200 dark:border-[#4d4635] hover:border-primary-300 dark:hover:border-[#f2ca50]/50 bg-white dark:bg-[#252119] text-secondary-900 dark:text-[#eae1d4]"
          )}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-secondary-500 dark:text-[#d0c5af]">timer</span>
            <span className="text-sm font-medium">{durationHours} {durationHours === 1 ? 'Hour' : 'Hours'}</span>
          </div>
          <span className="material-symbols-outlined text-[16px] text-secondary-500 dark:text-[#d0c5af]">expand_more</span>
        </button>
        {showDurationPicker && (
          <div className="absolute top-full left-0 mt-2 z-50 w-full max-h-60 overflow-y-auto custom-scrollbar bg-white/95 dark:bg-[#252119]/95 backdrop-blur-md border border-secondary-200 dark:border-[#4d4635] rounded-xl shadow-lg animate-slide-up origin-top p-1">
            {durationOptions.map((hours) => (
              <button
                key={hours}
                onClick={() => {
                  onDurationChange(hours);
                  setShowDurationPicker(false);
                }}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  durationHours === hours
                    ? "bg-primary-50 text-primary-700 dark:bg-[#f2ca50]/10 dark:text-[#f2ca50]"
                    : "text-secondary-700 dark:text-[#eae1d4] hover:bg-secondary-50 dark:hover:bg-white/5"
                )}
              >
                {hours} {hours === 1 ? 'Hour' : 'Hours'}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

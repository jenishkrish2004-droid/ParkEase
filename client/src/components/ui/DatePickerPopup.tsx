import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface DatePickerPopupProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onClose: () => void;
  className?: string;
}

export function DatePickerPopup({ selectedDate, onSelectDate, onClose, className }: DatePickerPopupProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = selectedDate ? new Date(selectedDate) : new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const currentSelected = selectedDate ? new Date(selectedDate) : null;
  if (currentSelected) currentSelected.setHours(0, 0, 0, 0);

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    return new Date(year, month + 1, 0).getDate();
  }, [currentMonth]);

  const firstDayOfMonth = useMemo(() => {
    return currentMonth.getDay();
  }, [currentMonth]);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (newDate < today) return; // Disabled
    onSelectDate(newDate.toISOString());
    onClose();
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className={cn("w-[280px] bg-white/95 dark:bg-[#252119]/95 backdrop-blur-md rounded-2xl shadow-2xl border border-secondary-200 dark:border-[#4d4635] p-4 z-50", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={handlePrevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary-100 dark:hover:bg-white/10 text-secondary-500 dark:text-[#d0c5af] transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">chevron_left</span>
        </button>
        <span className="font-bold text-secondary-900 dark:text-[#eae1d4] text-[14px]">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </span>
        <button 
          onClick={handleNextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary-100 dark:hover:bg-white/10 text-secondary-500 dark:text-[#d0c5af] transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-3">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-center text-xs font-semibold text-secondary-400 dark:text-[#d0c5af]/60 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
          date.setHours(0, 0, 0, 0);
          
          const isPast = date < today;
          const isSelected = currentSelected && date.getTime() === currentSelected.getTime();
          const isToday = date.getTime() === today.getTime();

          return (
            <button
              key={day}
              disabled={isPast}
              onClick={() => handleDateClick(day)}
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded-full text-xs transition-all duration-200 mx-auto",
                isPast && "text-secondary-300 dark:text-[#4d4635] cursor-not-allowed opacity-50",
                !isPast && !isSelected && "text-secondary-700 dark:text-[#eae1d4] hover:bg-secondary-100 dark:hover:bg-white/10",
                isSelected && "bg-primary-500 text-white dark:bg-[#f2ca50] dark:text-[#3c2f00] font-bold shadow-md dark:shadow-[0_0_10px_rgba(242,202,80,0.4)] scale-105",
                isToday && !isSelected && "border border-primary-500 dark:border-[#f2ca50] text-primary-600 dark:text-[#f2ca50]"
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

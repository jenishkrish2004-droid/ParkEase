import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export type SortOption = 'Nearest First' | 'Lowest Price' | 'Highest Availability' | 'Best Rated' | 'Recommended';

interface SortSelectorProps {
  selectedSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const SORT_OPTIONS: SortOption[] = [
  'Recommended',
  'Nearest First',
  'Lowest Price',
  'Highest Availability',
  'Best Rated',
];

export function SortSelector({ selectedSort, onSortChange }: SortSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-3 relative" ref={dropdownRef}>
      <span className="text-xs font-bold text-secondary-500 dark:text-[#d0c5af] uppercase tracking-widest hidden sm:inline-block">Sort By</span>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between gap-2 bg-white dark:bg-[#1a1712] border transition-all duration-200 px-4 py-2 rounded-xl text-sm font-bold shadow-sm w-[180px]",
          isOpen ? "border-primary-500 dark:border-[#f2ca50] ring-2 ring-primary-500/20 dark:ring-[#f2ca50]/20" : "border-secondary-200 dark:border-[#4d4635] hover:border-secondary-300 dark:hover:border-[#6b624b]"
        )}
      >
        <span className="text-secondary-900 dark:text-[#eae1d4] truncate">{selectedSort}</span>
        <span className={cn("material-symbols-outlined text-[18px] text-secondary-400 transition-transform duration-200", isOpen && "rotate-180")}>
          expand_more
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-full sm:w-[220px] bg-white dark:bg-[#110e07] border border-secondary-200 dark:border-[#4d4635] rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in py-1">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => {
                onSortChange(option);
                setIsOpen(false);
              }}
              className={cn(
                "w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors flex items-center justify-between",
                selectedSort === option 
                  ? "bg-primary-50 dark:bg-[#f2ca50]/10 text-primary-700 dark:text-[#f2ca50]" 
                  : "text-secondary-700 dark:text-[#d0c5af] hover:bg-secondary-50 dark:hover:bg-[#252119]"
              )}
            >
              {option}
              {selectedSort === option && (
                <span className="material-symbols-outlined text-[16px]">check</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

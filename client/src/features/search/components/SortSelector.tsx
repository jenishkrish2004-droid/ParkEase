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
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-semibold text-secondary-600 dark:text-[#d0c5af]">Sort By:</span>
      <div className="relative">
        <select
          value={selectedSort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="appearance-none bg-white dark:bg-[#1a1712] border border-secondary-200 dark:border-[#4d4635] text-secondary-900 dark:text-[#eae1d4] text-sm font-semibold rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/50 cursor-pointer shadow-sm transition-shadow hover:shadow-md"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option} value={option} className="dark:bg-[#110e07]">{option}</option>
          ))}
        </select>
        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-secondary-500 pointer-events-none">
          expand_more
        </span>
      </div>
    </div>
  );
}

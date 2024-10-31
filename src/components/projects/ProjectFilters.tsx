import React from 'react';
import { Search, SortAsc, SortDesc } from 'lucide-react';

interface ProjectFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSortChange: (field: string) => void;
  onSortDirectionChange: () => void;
}

export function ProjectFilters({
  searchQuery,
  onSearchChange,
  sortField,
  sortDirection,
  onSortChange,
  onSortDirectionChange,
}: ProjectFiltersProps) {
  const sortOptions = [
    { value: 'name', label: 'Название' },
    { value: 'deadline', label: 'Срок' },
    { value: 'budget', label: 'Бюджет' },
    { value: 'progress', label: 'Прогресс' },
  ];

  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
      <div className="flex-1">
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Поиск проектов..."
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <select
          value={sortField}
          onChange={(e) => onSortChange(e.target.value)}
          className="block w-40 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          onClick={onSortDirectionChange}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {sortDirection === 'asc' ? (
            <SortAsc className="h-4 w-4" />
          ) : (
            <SortDesc className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';

/**
 * Custom hook for debouncing values
 * Useful for search inputs, API calls, etc.
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook for debounced search with loading state
 * @param searchTerm - The search term
 * @param delay - Debounce delay in milliseconds
 * @returns Object with debouncedValue and isSearching state
 */
export function useDebouncedSearch(searchTerm: string, delay: number = 300) {
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, delay);

  useEffect(() => {
    if (searchTerm !== debouncedSearchTerm) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [searchTerm, debouncedSearchTerm]);

  return {
    debouncedValue: debouncedSearchTerm,
    isSearching,
  };
}

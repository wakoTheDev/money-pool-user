/**
 * Utility functions for safe localStorage operations
 * Handles SSR and localStorage errors gracefully
 */

export const isClient = typeof window !== 'undefined';

/**
 * Safely get item from localStorage
 * @param key - Storage key
 * @param defaultValue - Default value if key doesn't exist
 * @returns Parsed value or default value
 */
export function getFromStorage<T>(key: string, defaultValue: T): T {
  if (!isClient) return defaultValue;
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Safely set item to localStorage
 * @param key - Storage key
 * @param value - Value to store
 * @returns Success boolean
 */
export function setToStorage<T>(key: string, value: T): boolean {
  if (!isClient) return false;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Error setting localStorage key "${key}":`, error);
    return false;
  }
}

/**
 * Safely remove item from localStorage
 * @param key - Storage key
 * @returns Success boolean
 */
export function removeFromStorage(key: string): boolean {
  if (!isClient) return false;
  
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`Error removing localStorage key "${key}":`, error);
    return false;
  }
}

/**
 * Clear all localStorage data
 * @returns Success boolean
 */
export function clearStorage(): boolean {
  if (!isClient) return false;
  
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.warn('Error clearing localStorage:', error);
    return false;
  }
}

/**
 * Check if localStorage is available and functional
 * @returns Availability boolean
 */
export function isStorageAvailable(): boolean {
  if (!isClient) return false;
  
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

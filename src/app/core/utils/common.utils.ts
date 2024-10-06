export const getLocalStorage = <T>(key: string): T | null => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const value = localStorage.getItem(key);
    if (value) {
      return JSON.parse(value) as T;
    }
  }
  return null;
};

export const setLocalStorage = <T>(key: string, value: T): void => {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
};

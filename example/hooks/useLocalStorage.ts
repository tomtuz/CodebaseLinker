import { useEffect, useState } from "react";

export function useLocalStorage() {
  const [loadingStates, setLoadingStates] = useState<Map<string, boolean>>(
    new Map()
  );

  const setStorageValue = <T>(key: string, value: T) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  const getStorageValue = <T>(
    key: string,
    fallbackValue?: T
  ): [T | undefined, boolean] => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setStorageValue] = useState<T | undefined>(fallbackValue);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      setIsLoading(loadingStates.get(key) ?? true);

      try {
        const item = window.localStorage.getItem(key);
        setStorageValue(item !== null ? JSON.parse(item) : fallbackValue);
      } catch (error) {
        console.error(error);
        setStorageValue(fallbackValue);
      } finally {
        setIsLoading(false);
        setLoadingStates((prev) => new Map(prev).set(key, false));
      }
    }, [key, fallbackValue]);

    return [value, isLoading];
  };

  // Effect to update component when localStorage changes
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key) {
        setLoadingStates((prev) =>
          new Map(prev).set(event.key as string, true)
        );
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return { getStorageValue, setStorageValue };
}

import {useState, useEffect, useCallback, useRef} from 'react';

export const useStateWithCallbackLazy = <T>(initialValue: T) => {
  const callbackRef = useRef<((value: T) => void) | null>(null);

  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    if (callbackRef.current) {
      callbackRef.current(value);
      callbackRef.current = null;
    }
  }, [value]);

  const setValueWithCallback = useCallback(
    (newValue: T, callback?: (value: T) => void) => {
      if (callback) {
        callbackRef.current = callback;
      }
      setValue(newValue);
    },
    [],
  );

  return [value, setValueWithCallback] as const;
};

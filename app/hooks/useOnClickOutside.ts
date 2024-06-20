import { RefObject, useCallback, useEffect } from 'react';

const useOnClickOutside = <T extends HTMLElement>(
  ref: RefObject<T>,
  handler: Function,
) => {
  const listener = useCallback(
    (event: Event) => {
      if (!(event.target instanceof Node)) return;
      const isInside = ref.current?.contains(event.target);
      if (isInside) return;
      handler();
    },
    [ref, handler],
  );

  useEffect(() => {
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [listener]);
};

export default useOnClickOutside;

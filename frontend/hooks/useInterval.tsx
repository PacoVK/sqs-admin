import { useEffect, useRef } from "react";

const useInterval = (callback: () => void, delay: any) => {
  const savedCallback = useRef();

  useEffect(() => {
    // @ts-ignore
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    // @ts-ignore
    const tick = () => savedCallback.current();
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => {
        clearInterval(id);
      };
    }
  }, [callback, delay]);
};

export default useInterval;

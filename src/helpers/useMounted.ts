import { EffectCallback, useEffect, useRef } from "react";

export const useMounted = (fn: EffectCallback) => {
  const isMountedRef = useRef(false);
  useEffect(() => {
    if (isMountedRef.current) return;
    isMountedRef.current = true;
    fn();
  }, []);
};

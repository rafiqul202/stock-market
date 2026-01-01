"use client";

import { useCallback, useRef } from "react";

export function useDebounce(callback, delay) {
  const timeOutRef = useRef(null);
  return useCallback(() => {
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current)
    };
    timeOutRef.current = setTimeout(callback,delay);
  },[callback,delay])
}
"use client";

import { useEffect, useRef, useState } from "react";

/** Measure a container with a ResizeObserver. Returns a ref to put
    on the box and its current { w, h } in CSS pixels. Charts size
    themselves to the panel they land in. */
export function useSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      setSize({ w: Math.round(width), h: Math.round(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, ...size };
}

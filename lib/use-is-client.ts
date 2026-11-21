"use client";

import { useSyncExternalStore } from "react";

/** True only after client hydration; false during SSR/prerender. */
export function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

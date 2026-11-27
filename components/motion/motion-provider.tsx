"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/**
 * Motion preference store.
 *
 * Resolution order: explicit user choice (persisted) → OS preference → full
 * motion. The resolved state is written to <html data-reduce-motion> so CSS
 * can honour it without React re-rendering the tree (brief §07A, §08, §15).
 */

type MotionState = {
  /** User/system preference for reduced motion. */
  reduce: boolean;
  setReduce: (value: boolean) => void;
  /** False until the client has read storage — avoids hydration mismatch. */
  ready: boolean;
};

const MotionContext = createContext<MotionState>({
  reduce: false,
  setReduce: () => {},
  ready: false,
});

const STORAGE_KEY = "flyriise:motion";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [reduce, setReduceState] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      stored = null;
    }
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const next = stored === "reduce" ? true : stored === "full" ? false : prefersReduced;
    setReduceState(next);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.dataset.reduceMotion = reduce ? "true" : "false";
    try {
      window.localStorage.setItem(STORAGE_KEY, reduce ? "reduce" : "full");
    } catch {
      /* storage unavailable — preference simply does not persist */
    }
  }, [reduce, ready]);

  const setReduce = useCallback((value: boolean) => setReduceState(value), []);

  const value = useMemo<MotionState>(() => ({ reduce, setReduce, ready }), [reduce, setReduce, ready]);

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

export function useMotion(): MotionState {
  return useContext(MotionContext);
}

/** True when motion should be suppressed — user choice or OS preference. */
export function useStillness(): boolean {
  const { reduce } = useMotion();
  const [systemReduce, setSystemReduce] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setSystemReduce(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduce || systemReduce;
}

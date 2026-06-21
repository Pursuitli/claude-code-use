'use client';

/**
 * Lightweight data-fetching hooks for the bus app.
 *
 * Rather than pull in React Query / SWR, the app uses two small hooks:
 *  - useAsync:   run a one-shot async loader (used for static, cached data).
 *  - usePolling: run an async loader now and then on an interval, with an
 *                AbortController so in-flight ETA requests are cancelled on
 *                unmount / dependency change. This drives live ETA refresh.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

export interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  /** Force a re-run. */
  reload: () => void;
}

/** Run `loader` once (and on dependency change). */
export function useAsync<T>(loader: () => Promise<T>, deps: unknown[]): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    loader()
      .then((d) => alive && setData(d))
      .catch((e) => alive && setError(e instanceof Error ? e : new Error(String(e))))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);
  return { data, error, loading, reload };
}

export interface PollingState<T> extends AsyncState<T> {
  /** When the last successful fetch resolved. */
  updatedAt: Date | null;
  /** True while a manual/auto refresh is in flight (data already present). */
  refreshing: boolean;
}

/**
 * Run `loader(signal)` immediately and every `intervalMs`. Pass null/0 interval
 * to disable auto-refresh. Returns data plus an `updatedAt` timestamp and a
 * `reload` for pull-to-refresh / manual refresh buttons.
 */
export function usePolling<T>(
  loader: (signal: AbortSignal) => Promise<T>,
  intervalMs: number,
  deps: unknown[],
): PollingState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(async () => {
    const controller = new AbortController();
    setRefreshing(true);
    try {
      const d = await loaderRef.current(controller.signal);
      setData(d);
      setError(null);
      setUpdatedAt(new Date());
    } catch (e) {
      if ((e as Error)?.name !== 'AbortError') {
        setError(e instanceof Error ? e : new Error(String(e)));
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
    return controller;
  }, deps);

  useEffect(() => {
    let controller: AbortController | undefined;
    let cancelled = false;
    setLoading(true);
    run().then((c) => {
      if (cancelled) c.abort();
      else controller = c;
    });

    let timer: ReturnType<typeof setInterval> | undefined;
    if (intervalMs && intervalMs > 0) {
      timer = setInterval(() => {
        run().then((c) => {
          controller?.abort();
          controller = c;
        });
      }, intervalMs);
    }
    return () => {
      cancelled = true;
      controller?.abort();
      if (timer) clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, intervalMs]);

  return { data, error, loading, refreshing, updatedAt, reload: () => void run() };
}

/** Default ETA refresh cadence (ms). */
export const ETA_INTERVAL = 30000;

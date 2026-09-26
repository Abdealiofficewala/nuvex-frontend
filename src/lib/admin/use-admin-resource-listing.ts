"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CONTENT_UPDATED_EVENT } from "@/lib/constants";

type UseAdminResourceListingOptions<T> = {
  load: () => Promise<T[]>;
  onLoadError?: (error: unknown) => void;
  /** Re-fetch when these values change (e.g. filter id). */
  deps?: readonly unknown[];
};

export function useAdminResourceListing<T>({
  load,
  onLoadError,
  deps = [],
}: UseAdminResourceListingOptions<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const loadRef = useRef(load);
  const onLoadErrorRef = useRef(onLoadError);

  loadRef.current = load;
  onLoadErrorRef.current = onLoadError;

  const refresh = useCallback(async () => {
    setListLoading(true);
    try {
      setItems(await loadRef.current());
    } catch (error) {
      onLoadErrorRef.current?.(error);
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      void refresh();
    });
    const onUpdated = () => void refresh();
    window.addEventListener(CONTENT_UPDATED_EVENT, onUpdated);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener(CONTENT_UPDATED_EVENT, onUpdated);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- caller controls re-fetch via deps
  }, [refresh, ...deps]);

  return { items, setItems, listLoading, refresh };
}

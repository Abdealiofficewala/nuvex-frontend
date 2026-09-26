"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ADMIN_TABLE_DEFAULT_PAGE_SIZE,
  ADMIN_TABLE_PAGE_SIZE_OPTIONS,
  paginateItems,
  type AdminPaginationState,
} from "@/lib/admin/admin-pagination";

type UseAdminPaginationOptions = {
  enabled?: boolean;
  pageSize?: number;
  pageSizeOptions?: readonly number[];
};

export function useAdminPagination<T>(
  items: readonly T[],
  {
    enabled = true,
    pageSize: initialPageSize = ADMIN_TABLE_DEFAULT_PAGE_SIZE,
    pageSizeOptions = ADMIN_TABLE_PAGE_SIZE_OPTIONS,
  }: UseAdminPaginationOptions = {},
) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  useEffect(() => {
    setPage(1);
  }, [items.length, pageSize]);

  const pagination = useMemo(() => {
    if (!enabled) {
      const totalCount = items.length;

      return {
        items: [...items],
        page: 1,
        pageSize: totalCount || initialPageSize,
        totalCount,
        totalPages: 1,
        rangeStart: totalCount === 0 ? 0 : 1,
        rangeEnd: totalCount,
      };
    }

    return paginateItems(items, page, pageSize);
  }, [enabled, initialPageSize, items, page, pageSize]);

  useEffect(() => {
    if (pagination.page !== page) {
      setPage(pagination.page);
    }
  }, [page, pagination.page]);

  function goToPage(nextPage: number) {
    setPage(Math.min(Math.max(1, nextPage), pagination.totalPages));
  }

  function changePageSize(nextPageSize: number) {
    if (!pageSizeOptions.includes(nextPageSize)) {
      return;
    }

    setPageSize(nextPageSize);
  }

  return {
    rows: pagination.items,
    page: pagination.page,
    pageSize: pagination.pageSize,
    totalCount: pagination.totalCount,
    totalPages: pagination.totalPages,
    rangeStart: pagination.rangeStart,
    rangeEnd: pagination.rangeEnd,
    pageSizeOptions,
    enabled,
    setPage: goToPage,
    setPageSize: changePageSize,
  };
}

export type UseAdminPaginationResult<T> = ReturnType<typeof useAdminPagination<T>> &
  AdminPaginationState;

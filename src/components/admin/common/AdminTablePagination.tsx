"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { getVisiblePageNumbers } from "@/lib/admin/admin-pagination";
import { cn } from "@/lib/utils";

type AdminTablePaginationProps = {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  rangeStart: number;
  rangeEnd: number;
  pageSizeOptions: readonly number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  disabled?: boolean;
  className?: string;
};

function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AdminTablePagination({
  page,
  pageSize,
  totalCount,
  totalPages,
  rangeStart,
  rangeEnd,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
  disabled = false,
  className,
}: AdminTablePaginationProps) {
  const t = useTranslations("admin.common.pagination");
  const pageItems = useMemo(() => getVisiblePageNumbers(page, totalPages), [page, totalPages]);

  const summary =
    totalCount === 0
      ? t("empty")
      : rangeStart === rangeEnd
        ? t("summarySingle", { total: totalCount })
        : t("summary", { start: rangeStart, end: rangeEnd, total: totalCount });

  return (
    <div className={cn("admin-table-pagination", className)}>
      <p className="admin-table-pagination__summary">{summary}</p>

      <div className="admin-table-pagination__controls">
        <label className="admin-table-pagination__page-size">
          <span className="admin-table-pagination__page-size-label">{t("pageSize")}</span>
          <span className="admin-table-pagination__page-size-field">
            <select
              className="admin-table-pagination__page-size-select"
              value={pageSize}
              disabled={disabled || totalCount === 0}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
              aria-label={t("pageSize")}
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDownIcon />
          </span>
        </label>

        {totalPages > 1 ? (
          <nav className="admin-table-pagination__nav" aria-label={t("navLabel")}>
            <button
              type="button"
              className="admin-table-pagination__control admin-table-pagination__control--arrow"
              disabled={disabled || page <= 1}
              aria-label={t("previous")}
              onClick={() => onPageChange(page - 1)}
            >
              <ChevronLeftIcon />
            </button>

            {pageItems.map((item, index) =>
              item === "ellipsis" ? (
                <span
                  key={`ellipsis-${index}`}
                  className="admin-table-pagination__ellipsis"
                  aria-hidden="true"
                >
                  …
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  className={cn(
                    "admin-table-pagination__control admin-table-pagination__control--page",
                    item === page && "is-active",
                  )}
                  disabled={disabled}
                  aria-current={item === page ? "page" : undefined}
                  aria-label={t("goToPage", { page: item })}
                  onClick={() => onPageChange(item)}
                >
                  {item}
                </button>
              ),
            )}

            <button
              type="button"
              className="admin-table-pagination__control admin-table-pagination__control--arrow"
              disabled={disabled || page >= totalPages}
              aria-label={t("next")}
              onClick={() => onPageChange(page + 1)}
            >
              <ChevronRightIcon />
            </button>
          </nav>
        ) : null}
      </div>
    </div>
  );
}

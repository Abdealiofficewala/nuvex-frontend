export const ADMIN_TABLE_PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

export const ADMIN_TABLE_DEFAULT_PAGE_SIZE = ADMIN_TABLE_PAGE_SIZE_OPTIONS[0];

export type AdminPaginationState = {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  rangeStart: number;
  rangeEnd: number;
};

export type AdminPaginationPageItem = number | "ellipsis";

export function getVisiblePageNumbers(
  page: number,
  totalPages: number,
  siblingCount = 1,
): AdminPaginationPageItem[] {
  if (totalPages <= 1) {
    return totalPages === 1 ? [1] : [];
  }

  const pages = new Set<number>([1, totalPages, page]);

  for (let offset = 1; offset <= siblingCount; offset += 1) {
    pages.add(page - offset);
    pages.add(page + offset);
  }

  const sortedPages = [...pages].filter((value) => value >= 1 && value <= totalPages).sort((a, b) => a - b);
  const items: AdminPaginationPageItem[] = [];

  sortedPages.forEach((value, index) => {
    const previous = sortedPages[index - 1];

    if (previous !== undefined && value - previous > 1) {
      items.push("ellipsis");
    }

    items.push(value);
  });

  return items;
}

export function paginateItems<T>(
  items: readonly T[],
  page: number,
  pageSize: number,
): AdminPaginationState & { items: T[] } {
  const totalCount = items.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    page: safePage,
    pageSize,
    totalCount,
    totalPages,
    rangeStart: totalCount === 0 ? 0 : start + 1,
    rangeEnd: Math.min(start + pageSize, totalCount),
  };
}

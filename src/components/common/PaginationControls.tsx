import type { PaginationMeta } from '../../types/api';

interface PaginationControlsProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

function getPageWindow(currentPage: number, lastPage: number): number[] {
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(lastPage, currentPage + 2);
  const pages: number[] = [];

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  return pages;
}

export function PaginationControls({
  meta,
  onPageChange,
}: PaginationControlsProps) {
  const {
    current_page: currentPage,
    last_page: lastPage,
    total,
    from,
    to,
  } = meta.pagination;

  if (lastPage <= 1) {
    return null;
  }

  return (
    <div className="pagination">
      <p className="pagination-copy">
        Showing {from ?? 0}-{to ?? 0} of {total}
      </p>
      <div className="pagination-controls">
        <button
          className="button button-secondary"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          type="button"
        >
          Previous
        </button>
        {getPageWindow(currentPage, lastPage).map((page) => (
          <button
            className={`page-chip${page === currentPage ? ' is-active' : ''}`}
            key={page}
            onClick={() => onPageChange(page)}
            type="button"
          >
            {page}
          </button>
        ))}
        <button
          className="button button-secondary"
          disabled={currentPage >= lastPage}
          onClick={() => onPageChange(currentPage + 1)}
          type="button"
        >
          Next
        </button>
      </div>
    </div>
  );
}

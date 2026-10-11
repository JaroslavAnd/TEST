"use client";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button key="1" onClick={() => onChange(1)} className="px-3 py-1 rounded bg-surface border border-border">1</button>
      );
      if (startPage > 2) pages.push(<span key="start-ellipsis" className="px-2">...</span>);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onChange(i)}
          className={`px-3 py-1 rounded border transition-colors ${
            page === i
              ? "bg-primary text-white border-primary"
              : "bg-surface border-border hover:border-primary text-text-main"
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push(<span key="end-ellipsis" className="px-2">...</span>);
      pages.push(
        <button key={totalPages} onClick={() => onChange(totalPages)} className="px-3 py-1 rounded bg-surface border border-border hover:border-primary text-text-main">
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-1 rounded bg-surface border border-border disabled:opacity-50 text-text-main hover:border-primary transition-colors disabled:hover:border-border"
      >
        Попередня
      </button>
      
      <div className="flex items-center space-x-1">
        {renderPageNumbers()}
      </div>
      
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1 rounded bg-surface border border-border disabled:opacity-50 text-text-main hover:border-primary transition-colors disabled:hover:border-border"
      >
        Наступна
      </button>
    </div>
  );
}

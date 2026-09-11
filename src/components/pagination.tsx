interface PaginationProps {
    pageno: number;
    setPage: (page: number) => void;
    disabled: {prev: boolean;
    next: boolean};
}

export default function Pagination({setPage, pageno, disabled}: PaginationProps){
    return(
    <div className="text-[#A13924]">
    <button
      type="button"
      aria-label="Previous page"
      className="cursor-pointer pr-1 text-[25px] duration-200 hover:-translate-x-1 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
      onClick={() => setPage(Math.max(1, pageno - 1))}
      disabled={disabled.prev}
    >«</button>
  <span className="px-1 text-[16px]">Page {pageno}</span>
  <button
    type="button"
    aria-label="Next page"
    className="cursor-pointer pl-1 text-[25px] duration-200 hover:translate-x-1 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
    onClick={() => setPage(pageno + 1)}
    disabled={disabled.next}
  >»</button>
    </div>
    )
}
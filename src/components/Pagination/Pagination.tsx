import ReactPaginateImport from 'react-paginate';
import css from './Pagination.module.css';

const ReactPaginate =
  (
    ReactPaginateImport as unknown as {
      default: typeof ReactPaginateImport;
    }
  ).default ?? ReactPaginateImport;

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  pageCount,
  currentPage,
  onPageChange,
}: PaginationProps) {
  const handlePageChange = (selectedItem: { selected: number }) => {
    onPageChange(selectedItem.selected + 1);
  };

  return (
    <ReactPaginate
      previousLabel="←"
      nextLabel="→"
      pageCount={pageCount}
      forcePage={currentPage - 1}
      onPageChange={handlePageChange}
      containerClassName={css.pagination}
      activeClassName={css.active}
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
    />
  );
}

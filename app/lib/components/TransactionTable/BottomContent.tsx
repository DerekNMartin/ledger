import { Pagination, Select, ListBox } from '@heroui/react';

export type TransactionTableBottomContentProps = {
  totalEntries: number;
  perPage: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (value: string) => void;
};

const PAGE_SIZE_OPTIONS = [
  { key: '25', label: '25' },
  { key: '50', label: '50' },
  { key: '100', label: '100' },
];

export function TransactionTableBottomContent({
  totalEntries,
  perPage,
  currentPage,
  totalPages,
  onPerPageChange,
  onPageChange,
}: TransactionTableBottomContentProps) {
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    pages.push(1);
    if (currentPage > 3) {
      pages.push('ellipsis');
    }
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) {
      pages.push('ellipsis');
    }
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };

  const startItem = (currentPage - 1) * Number(perPage) + 1;
  const endItem = Math.min(currentPage * Number(perPage), totalEntries);

  return (
    <div className="w-full flex justify-between items-center">
      <Pagination className="w-full">
        <Pagination.Summary>
          Showing {startItem}-{endItem} of {totalEntries} results
        </Pagination.Summary>
        <Pagination.Content>
          {/* Page Size Controls */}
          <Select
            value={perPage}
            onChange={(value) => (typeof value === 'string' ? onPerPageChange(value) : null)}
          >
            <Select.Trigger className="rounded-lg shadow-none border border-violet-200 w-20">
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {PAGE_SIZE_OPTIONS.map(({ key, label }) => (
                  <ListBox.Item key={key} id={key} textValue={label}>
                    {label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
          <Pagination.Item>
            <Pagination.Previous
              isDisabled={currentPage === 1}
              onPress={() => onPageChange(currentPage - 1)}
            >
              <Pagination.PreviousIcon />
            </Pagination.Previous>
          </Pagination.Item>
          {getPageNumbers().map((p, i) =>
            p === 'ellipsis' ? (
              <Pagination.Item key={`ellipsis-${i}`}>
                <Pagination.Ellipsis />
              </Pagination.Item>
            ) : (
              <Pagination.Item key={p}>
                <Pagination.Link
                  isActive={p === currentPage}
                  onPress={() => onPageChange(p)}
                  className={p === currentPage ? 'bg-violet-200' : ''}
                >
                  {p}
                </Pagination.Link>
              </Pagination.Item>
            )
          )}
          <Pagination.Item>
            <Pagination.Next
              isDisabled={currentPage === totalPages}
              onPress={() => onPageChange(currentPage + 1)}
            >
              <Pagination.NextIcon />
            </Pagination.Next>
          </Pagination.Item>
        </Pagination.Content>
      </Pagination>
    </div>
  );
}

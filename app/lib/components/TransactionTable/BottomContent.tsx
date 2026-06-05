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
  return (
    <div className="w-full flex justify-between items-center py-6 border-t border-neutral-200">
      <p>
        <strong>{totalEntries}</strong> transactions
      </p>
      <div className="flex gap-4 flex-1 justify-end items-center">
        {/* Page Size Controls */}
        <Select
          className="max-w-20"
          value={perPage}
          onChange={(value) => (typeof value === 'string' ? onPerPageChange(value) : null)}
        >
          <Select.Trigger>
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
        <Pagination>
          <Pagination.Content>
            <Pagination.Item>
              <Pagination.Previous
                isDisabled={currentPage === 1}
                onPress={() => onPageChange(Math.max(1, currentPage - 1))}
              >
                <Pagination.PreviousIcon />
              </Pagination.Previous>
            </Pagination.Item>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Pagination.Item key={p}>
                <Pagination.Link isActive={currentPage === p} onPress={() => onPageChange(p)}>
                  {p}
                </Pagination.Link>
              </Pagination.Item>
            ))}
            <Pagination.Item>
              <Pagination.Next
                isDisabled={currentPage === totalPages}
                onPress={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              >
                <Pagination.NextIcon />
              </Pagination.Next>
            </Pagination.Item>
          </Pagination.Content>
        </Pagination>
      </div>
    </div>
  );
}

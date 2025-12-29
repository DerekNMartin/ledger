import { Pagination, Select, SelectItem } from '@heroui/react';

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
    <div className="w-full flex justify-between items-center p-6 border-t border-neutral-200">
      <p>
        Total: <strong>{totalEntries}</strong> transactions
      </p>
      <div className="flex gap-4 flex-1 justify-end items-center">
        {/* Page Size Controls */}
        <Select
          className="max-w-20"
          size="sm"
          items={PAGE_SIZE_OPTIONS}
          selectedKeys={[perPage]}
          onChange={(event) => onPerPageChange(event.target.value)}
        >
          {(option) => <SelectItem>{option.label}</SelectItem>}
        </Select>
        <Pagination
          showControls
          size="sm"
          page={currentPage}
          total={totalPages}
          onChange={(page) => onPageChange(page)}
        />
      </div>
    </div>
  );
}

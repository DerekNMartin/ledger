import {
  Button,
  Dropdown,
  DropdownTrigger,
  Input,
  Select,
  SelectItem,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { FilterDropdown } from './FilterDropdown';

export type TransactionTableTopContentProps = {
  selectedYear: string;
  searchValue: string;
  onYearChange: (year: string) => void;
  onSearchChange: (search: string) => void;
  onDownloadClick: () => void;
  onFilterChange: (filters: Record<string, string[]>) => void;
};

const YEAR_FILTER_OPTIONS = [
  { key: '2026', label: '2026' },
  { key: '2025', label: '2025' },
  { key: '2024', label: '2024' },
];

export function TransactionTableTopContent({
  selectedYear,
  searchValue,
  onYearChange,
  onSearchChange,
  onDownloadClick,
  onFilterChange,
}: TransactionTableTopContentProps) {
  return (
    <section className="flex justify-between items-center p-6 border-b border-neutral-200">
      <Input
        className="max-w-xs"
        size="sm"
        placeholder="Search"
        value={searchValue}
        onValueChange={onSearchChange}
      />
      <div className="flex gap-4 items-center flex-1 justify-end">
        <Select
          className="max-w-24 shrink-0"
          size="sm"
          items={YEAR_FILTER_OPTIONS}
          selectedKeys={[selectedYear]}
          onChange={(event) => onYearChange(event.target.value)}
        >
          {(year) => <SelectItem>{year.label}</SelectItem>}
        </Select>
        <FilterDropdown filters={{}} onFilterChange={onFilterChange} />
        <Dropdown>
          <DropdownTrigger>
            <Button isIconOnly size="sm" variant="light" color="primary">
              <EllipsisVerticalIcon className="w-5 h-5" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem key="download" onClick={onDownloadClick}>
              Download
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </section>
  );
}

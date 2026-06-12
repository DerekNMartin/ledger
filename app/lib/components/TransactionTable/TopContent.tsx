import { Button, Dropdown, Input } from '@heroui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { FilterDropdown } from './FilterDropdown';
import { YearSelect } from '../YearSelect';

export type TransactionTableTopContentProps = {
  selectedYear: string;
  searchValue: string;
  onYearChange: (year: string | null) => void;
  onSearchChange: (search: string) => void;
  onDownloadClick: () => void;
  onFilterChange: (filters: Record<string, string[]>) => void;
};

export function TransactionTableTopContent({
  selectedYear,
  searchValue,
  onYearChange,
  onSearchChange,
  onDownloadClick,
  onFilterChange,
}: TransactionTableTopContentProps) {
  return (
    <section className="flex justify-between items-center px-2 py-4 h-fit">
      <Input
        className="w-sm shadow-none border border-neutral-200"
        placeholder="Search"
        aria-label="Search Transactions Input"
        value={searchValue}
        onChange={(event) => onSearchChange(event.target.value)}
      />
      <div className="flex gap-4 items-center flex-1 justify-end">
        <YearSelect selectedYear={selectedYear} onYearChange={onYearChange} />
        <FilterDropdown filters={{}} onFilterChange={onFilterChange} />
        <Dropdown>
          <Button isIconOnly variant="ghost">
            <EllipsisVerticalIcon className="w-5 h-5" />
          </Button>
          <Dropdown.Popover placement="bottom right">
            <Dropdown.Menu aria-label="Static Actions">
              <Dropdown.Item key="download" onClick={onDownloadClick}>
                Download
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      </div>
    </section>
  );
}

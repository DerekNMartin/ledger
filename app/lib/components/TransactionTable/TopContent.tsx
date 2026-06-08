import { Button, Dropdown, Input, Select, ListBox } from '@heroui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { FilterDropdown } from './FilterDropdown';

export type TransactionTableTopContentProps = {
  selectedYear: string;
  searchValue: string;
  onYearChange: (year: string | null) => void;
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
    <section className="flex justify-between items-center px-2 py-4 h-fit">
      <Input
        className="w-sm shadow-none border border-neutral-200"
        placeholder="Search"
        value={searchValue}
        onChange={(event) => onSearchChange(event.target.value)}
      />
      <div className="flex gap-4 items-center flex-1 justify-end">
        <Select
          className="shrink-0 w-32"
          value={selectedYear}
          onChange={(value) => (typeof value === 'string' ? onYearChange(value) : null)}
        >
          <Select.Trigger className="shadow-none border border-neutral-200">
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {YEAR_FILTER_OPTIONS.map(({ key, label }) => (
                <ListBox.Item key={key} id={key}>
                  <ListBox.ItemIndicator />
                  {label}
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
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

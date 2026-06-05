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
    <section className="flex justify-between items-center py-6 border-b border-neutral-200">
      <Input
        className={'max-w-sm outline-0'}
        placeholder="Search"
        value={searchValue}
        onChange={(event) => onSearchChange(event.target.value)}
      />
      <div className="flex gap-4 items-center flex-1 justify-end">
        <Select
          className="max-w-24 shrink-0"
          items={YEAR_FILTER_OPTIONS}
          value={selectedYear}
          onChange={(value) => (typeof value === 'string' ? onYearChange(value) : null)}
        >
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {YEAR_FILTER_OPTIONS.map(({ key, label }) => (
                <ListBox.Item key={key} id={key} textValue={label}>
                  {label}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
        <FilterDropdown filters={{}} onFilterChange={onFilterChange} />
        <Dropdown>
          <Button isIconOnly variant="primary">
            <EllipsisVerticalIcon className="w-5 h-5" />
          </Button>
          <Dropdown.Menu
            aria-label="Static Actions"
            onAction={(key) => (key === 'download' ? onDownloadClick : null)}
          >
            <Dropdown.Item key="download">Download</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </section>
  );
}

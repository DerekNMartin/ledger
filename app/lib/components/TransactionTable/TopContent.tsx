import { Input, Select, SelectItem } from '@heroui/react';

export type TransactionTableTopContentProps = {
  selectedYear: string;
  searchValue: string;
  onYearChange: (year: string) => void;
  onSearchChange: (search: string) => void;
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
      <Select
        className="max-w-24"
        size="sm"
        items={YEAR_FILTER_OPTIONS}
        selectedKeys={[selectedYear]}
        onChange={(event) => onYearChange(event.target.value)}
      >
        {(year) => <SelectItem>{year.label}</SelectItem>}
      </Select>
    </section>
  );
}

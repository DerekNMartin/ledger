import { Select, SelectItem } from '@heroui/react';

export type TransactionTableTopContentProps = {
  selectedYear: string;
  onYearChange: (year: string) => void;
};

const YEAR_FILTER_OPTIONS = [
  { key: '2026', label: '2026' },
  { key: '2025', label: '2025' },
  { key: '2024', label: '2024' },
];

export function TransactionTableTopContent({
  selectedYear,
  onYearChange,
}: TransactionTableTopContentProps) {
  return (
    <section className="flex justify-end p-6 pb-0">
      <Select
        className="max-w-xs"
        items={YEAR_FILTER_OPTIONS}
        selectedKeys={[selectedYear]}
        label="Year"
        onChange={(event) => onYearChange(event.target.value)}
      >
        {(year) => <SelectItem>{year.label}</SelectItem>}
      </Select>
    </section>
  );
}

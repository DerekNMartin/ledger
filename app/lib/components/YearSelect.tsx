'use client';

import { Select, ListBox } from '@heroui/react';

type YearSelectProps = {
  selectedYear: string;
  onYearChange: (year: string | null) => void;
};

const YEAR_FILTER_OPTIONS = [
  { key: '2026', label: '2026' },
  { key: '2025', label: '2025' },
  { key: '2024', label: '2024' },
];

export function YearSelect({ selectedYear, onYearChange }: YearSelectProps) {
  return (
    <Select
      className="shrink-0 w-32"
      value={selectedYear}
      onChange={(value) => (typeof value === 'string' ? onYearChange(value) : null)}
      aria-label="Year Filter Selection"
    >
      <Select.Trigger className="shadow-none border border-neutral-200">
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {YEAR_FILTER_OPTIONS.map(({ key, label }) => (
            <ListBox.Item key={key} id={key} textValue="label">
              <ListBox.ItemIndicator />
              {label}
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}

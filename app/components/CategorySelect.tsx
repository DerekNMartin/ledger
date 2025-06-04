import { Select, SelectItem } from '@heroui/react';
import type { SelectProps } from '@heroui/react';

export const categories = [
  { key: 'bills', label: 'Bills' },
  { key: 'cash', label: 'Cash' },
  { key: 'charity', label: 'Charity' },
  { key: 'eating', label: 'Eating Out' },
  { key: 'education', label: 'Education' },
  { key: 'entertainment', label: 'Entertainment' },
  { key: 'excluded', label: 'Excluded' },
  { key: 'general', label: 'General' },
  { key: 'groceries', label: 'Groceries' },
  { key: 'holidays', label: 'Holidays' },
  { key: 'housing', label: 'Housing' },
  { key: 'income', label: 'Income' },
  { key: 'investments', label: 'Investments' },
  { key: 'personal', label: 'Personal Care' },
  { key: 'shoping', label: 'Shopping' },
  { key: 'transport', label: 'Transport' },
];

export default function CategorySelect(props: Omit<SelectProps, 'children'>) {
  return (
    <Select {...props} aria-label="Category Selection" variant="bordered">
      {categories.map(({ key, label }) => (
        <SelectItem key={key}>{label}</SelectItem>
      ))}
    </Select>
  );
}

import { Select, ListBox, type SelectProps } from '@heroui/react';

export const CATEGORIES = [
  { key: 'bills', label: 'Bills' },
  { key: 'cash', label: 'Cash' },
  { key: 'charity', label: 'Charity' },
  { key: 'take_out', label: 'Eating Out' },
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
  { key: 'shopping', label: 'Shopping' },
  { key: 'transport', label: 'Transport' },
];

export default function CategorySelect(
  props: Omit<SelectProps<(typeof CATEGORIES)[0]>, 'children'>
) {
  return (
    <Select {...props} aria-label="Category Selection" variant="primary" placeholder="Category...">
      <Select.Trigger className={'shadow-none border border-violet-200'}>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {CATEGORIES.map(({ key, label }) => (
            <ListBox.Item key={key} id={key} textValue={label}>
              {label} <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}

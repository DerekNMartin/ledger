import { Select, SelectItem } from '@heroui/react';
import type { SelectProps } from '@heroui/react';

export const accounts = [
  { key: 'rbc-cc-visa', label: 'RBC Visa Credit Card' },
  { key: 'rbc-chequing', label: 'RBC Chequing' },
  { key: 'amex-cc-personal', label: 'AMEX Personal Credit Card' },
  { key: 'wealthsimple-cash', label: 'Wealthsimple Cash Account' },
  { key: 'scotia-cc-shared', label: 'Scotiabank Shared Credit Card' },
];

export default function AccountSelect(props: Omit<SelectProps, 'children'>) {
  return (
    <Select {...props} aria-label="Account Selection" variant="bordered">
      {accounts.map(({ key, label }) => (
        <SelectItem key={key}>{label}</SelectItem>
      ))}
    </Select>
  );
}

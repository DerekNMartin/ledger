import { Select, SelectItem } from '@heroui/react';
import type { SelectProps } from '@heroui/react';
import { useAccounts } from '@/lib/hooks/useAccounts';

export default function AccountSelect(props: Omit<SelectProps, 'children'>) {
  const { accounts } = useAccounts();

  return (
    <Select
      {...props}
      aria-label="Account Selection"
      variant="bordered"
      placeholder="Choose an account..."
    >
      {accounts?.map(({ id, name }) => <SelectItem key={id}>{name}</SelectItem>) || []}
    </Select>
  );
}

import { Select, SelectItem } from '@heroui/react';
import type { SelectProps } from '@heroui/react';
import { Account } from '@/lib/supabase/types';

export default function AccountSelect(
  props: { accounts: Account[] | null } & Omit<SelectProps, 'children'>
) {
  return (
    <Select
      {...props}
      aria-label="Account Selection"
      variant="bordered"
      placeholder="Choose an account..."
    >
      {props.accounts?.map(({ id, name }) => <SelectItem key={id}>{name}</SelectItem>) || []}
    </Select>
  );
}

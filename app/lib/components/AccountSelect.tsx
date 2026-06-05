import { Select, ListBox, type SelectProps } from '@heroui/react';
import { Account } from '@/lib/supabase/types';

export default function AccountSelect(
  props: { accounts: Account[] | null } & Omit<SelectProps<Account, 'single'>, 'children'>
) {
  return (
    <Select
      {...props}
      aria-label="Account Selection"
      variant="secondary"
      placeholder="Choose an account..."
    >
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {props.accounts?.map(({ id, name }) => (
            <ListBox.Item key={id} id={id} textValue={name}>
              {name} <ListBox.ItemIndicator />
            </ListBox.Item>
          )) || []}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}

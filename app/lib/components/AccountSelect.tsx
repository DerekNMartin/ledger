import { Select, ListBox, type SelectProps } from '@heroui/react';
import { Account } from '@/lib/supabase/types';
import { useAccounts } from '@/lib/hooks/useAccounts';

export default function AccountSelect(props: Omit<SelectProps<Account, 'single'>, 'children'>) {
  const { accounts } = useAccounts();

  return (
    <Select {...props} aria-label="Account Selection" placeholder="Choose an account...">
      <Select.Trigger className={'shadow-none border border-neutral-200'}>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {accounts?.map(({ id, name }) => (
            <ListBox.Item key={id} id={id.toString()} textValue={name}>
              {name} <ListBox.ItemIndicator />
            </ListBox.Item>
          )) || []}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}

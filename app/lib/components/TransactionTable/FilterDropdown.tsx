import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  Selection,
  SharedSelection,
} from '@heroui/react';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { CATEGORIES } from '@/lib/components/CategorySelect';
import { useState } from 'react';

export type FilterDropdownProps = {
  filters: Record<string, string[]>;
  onFilterChange: (filters: Record<string, string[]>) => void;
};

export function FilterDropdown({ filters, onFilterChange }: FilterDropdownProps) {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

  function handleSelectionChange(keys: SharedSelection) {
    setSelectedKeys(keys);
    onFilterChange({
      category: Array.from(keys)
        .filter((key) => key.toString().startsWith('category-'))
        .map((key) => key.toString().replace('category-', '')),
    });
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button size="sm" variant="bordered">
          <FunnelIcon className="w-4 h-4" />
          Filter
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Static Actions"
        closeOnSelect={false}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        onSelectionChange={handleSelectionChange}
        className="max-h-52 overflow-y-auto scrollbar-thin"
      >
        <DropdownSection title="Category">
          {CATEGORIES.map((category) => (
            <DropdownItem key={`category-${category.key}`}>{category.label}</DropdownItem>
          ))}
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}

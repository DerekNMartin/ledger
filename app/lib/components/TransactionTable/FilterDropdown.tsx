import { Button, Dropdown, Selection } from '@heroui/react';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { CATEGORIES } from '@/lib/components/CategorySelect';
import { useState } from 'react';

export type FilterDropdownProps = {
  filters: Record<string, string[]>;
  onFilterChange: (filters: Record<string, string[]>) => void;
};

export function FilterDropdown({ onFilterChange }: FilterDropdownProps) {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

  function handleSelectionChange(keys: Selection) {
    setSelectedKeys(keys);
    onFilterChange({
      category: Array.from(keys)
        .filter((key) => key.toString().startsWith('category-'))
        .map((key) => key.toString().replace('category-', '')),
    });
  }

  return (
    <Dropdown>
      <Button variant="secondary">
        <FunnelIcon className="w-4 h-4" />
        Filter
      </Button>
      <Dropdown.Popover>
        <Dropdown.Menu
          aria-label="Static Actions"
          selectedKeys={selectedKeys}
          selectionMode="multiple"
          onSelectionChange={handleSelectionChange}
          className="max-h-52 overflow-y-auto scrollbar-thin"
        >
          <Dropdown.Section>
            {CATEGORIES.map((category) => (
              <Dropdown.Item
                key={`category-${category.key}`}
                id={category.key}
                textValue={category.label}
              >
                {category.label}
                <Dropdown.ItemIndicator />
              </Dropdown.Item>
            ))}
          </Dropdown.Section>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}

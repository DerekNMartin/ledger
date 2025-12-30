import type { Transaction } from '@/lib/supabase/types';

import { useRef, useState } from 'react';

import { Button } from '@heroui/react';
import { Input } from '@heroui/react';
import { useAccounts } from '@/lib/hooks/useAccounts';

import AccountSelect from '@/lib/components/AccountSelect';

export default function TransactionUpload({
  onUpload,
}: {
  onUpload: (data: Transaction[]) => void;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [selectedAccount, setSelectedAccount] = useState<string>();
  const { accounts } = useAccounts();

  function getFormDataFile() {
    if (!fileInput?.current?.files) throw new Error('No files provided');
    const file = fileInput.current.files[0];
    if (!file) throw new Error('No files found');
    const formData = new FormData();
    formData.append('file', file);
    return formData;
  }

  const [isLoading, setIsLoading] = useState(false);
  async function uploadFile() {
    try {
      setIsLoading(true);
      const formData = getFormDataFile();
      if (selectedAccount) formData.append('account', selectedAccount);
      const response = await fetch('/api/transactions/upload', {
        method: 'POST',
        body: formData,
      });
      const data = (await response.json()) as { data: Transaction[] };
      onUpload(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex gap-2">
      <AccountSelect
        accounts={accounts}
        className="w-xs"
        selectedKeys={[selectedAccount || '']}
        onSelectionChange={(selection) => setSelectedAccount(selection.currentKey)}
      />
      <Input
        ref={fileInput}
        type="file"
        accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        placeholder="Upload transaction CSV file"
      />
      <Button
        onPress={uploadFile}
        color="primary"
        isLoading={isLoading}
        variant="bordered"
        isDisabled={!selectedAccount}
      >
        Upload File
      </Button>
    </div>
  );
}

import type { Transaction } from '../api/transactions/route';

import { useRef, useState } from 'react';

import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import AccountSelect from './AccountSelect';

export default function TransactionUpload({
  onUpload,
}: {
  onUpload: (data: Transaction[]) => void;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [selectedAccount, setSelectedAccount] = useState<string>();

  function getFormDataFile() {
    if (!fileInput?.current?.files) throw new Error('No files provided');
    const file = fileInput.current.files[0];
    if (!file) throw new Error('No files found');
    const formData = new FormData();
    formData.append('file', file);
    return formData;
  }

  async function uploadFile() {
    try {
      const formData = getFormDataFile();
      if (selectedAccount) formData.append('account', selectedAccount);
      const response = await fetch('api/transactions', {
        method: 'POST',
        body: formData,
      });
      const data = (await response.json()) as { data: Transaction[] };
      onUpload(data.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex gap-2">
      <AccountSelect
        className="w-56"
        selectedKeys={[selectedAccount || '']}
        onSelectionChange={(selection) => setSelectedAccount(selection.currentKey)}
      />
      <Input
        ref={fileInput}
        type="file"
        accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        placeholder="Upload transaction CSV file"
      />
      <Button onPress={uploadFile} color="primary">
        Upload File
      </Button>
    </div>
  );
}

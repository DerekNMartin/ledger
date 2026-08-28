import type { Transaction } from '@/lib/supabase/types';

import { useRef, useState } from 'react';

import { Button, Input } from '@heroui/react';

import AccountSelect from '@/lib/components/AccountSelect';

export default function TransactionUpload({
  onUpload,
}: {
  onUpload: (data: Transaction[]) => void;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [selectedAccount, setSelectedAccount] = useState<string>();

  function getFormDataFile() {
    if (!fileInput?.current?.files) throw new Error('No files provided');
    // Convert FileList to an Array to iterate
    const files = Array.from(fileInput.current.files);

    if (files.length === 0) throw new Error('No files found');

    const formData = new FormData();
    // Append each file using the same key 'file'
    files.forEach((file) => {
      formData.append('file', file);
    });

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
    <div className="flex gap-2 w-full">
      <AccountSelect
        className="w-xs"
        value={selectedAccount || ''}
        onChange={(selection) => setSelectedAccount(selection?.toString())}
      />
      <Input
        className={'flex-1 shadow-none border border-violet-200'}
        ref={fileInput}
        multiple
        type="file"
        accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        placeholder="Upload transaction CSV file"
      />
      <Button
        onPress={uploadFile}
        variant="secondary"
        isPending={isLoading}
        isDisabled={!selectedAccount}
      >
        Upload File
      </Button>
    </div>
  );
}

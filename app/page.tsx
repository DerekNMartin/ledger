'use client';

import type { Transaction } from './api/transactions/route';
import { useRef, useState } from 'react';

export default function Home() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [transactionData, setTransactionData] = useState<Transaction[]>();

  function getFormDataFile() {
    if (!fileInput?.current?.files) return;
    const pdfFile = fileInput.current.files[0];
    if (!pdfFile) return;
    const formData = new FormData();
    formData.append('file', pdfFile);
    return formData;
  }

  async function uploadFile() {
    const formData = getFormDataFile();
    try {
      const response = await fetch('api/transactions', {
        method: 'POST',
        body: formData,
      });
      const data = (await response.json()) as { data: Transaction[] };
      setTransactionData(data.data);
    } catch (error) {
      console.log(error);
    }
  }

  function dataTable(data?: Transaction[]) {
    if (!data) return;
    const headers = ['date', 'description', 'amount'].map((header, index) => (
      <th className="border border-neutral-700 capitalize p-2" key={index}>
        {header}
      </th>
    ));
    const rows = data.map((row, index) => {
      const date = new Date(row.date);
      return (
        <tr key={index}>
          <td className="border border-neutral-700 p-2">{date.toLocaleDateString()}</td>
          <td className="border border-neutral-700 p-2">{row.description}</td>
          <td className="border border-neutral-700 p-2">{row.amount}</td>
        </tr>
      );
    });
    return (
      <table className="border border-neutral-700">
        <thead>
          <tr>{headers}</tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }

  return (
    <div>
      <main>
        <input
          ref={fileInput}
          type="file"
          accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        />
        <button className="border border-neutral-500 px-2 py-1" onClick={uploadFile}>
          Upload File
        </button>
        <div>{dataTable(transactionData)}</div>
      </main>
    </div>
  );
}

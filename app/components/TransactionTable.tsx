import type { Transaction } from '../api/transactions/route';

export default function dataTable({ data }: { data?: Transaction[] }) {
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
